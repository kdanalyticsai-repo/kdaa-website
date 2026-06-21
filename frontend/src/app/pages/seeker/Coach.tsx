import { useState, useRef, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api, apiError, tokenStore } from '@/app/lib/api';
import { API_URL } from '@/app/lib/config';
import { Button, Spinner, useToast } from '@/app/components/ui';
import { FeatureGate } from '@/app/components/FeatureGate';

interface ChatMsg { role: string; content: string }
interface SessionItem { id: string; title: string }

const SUGGESTIONS = [
  'How do I negotiate a higher salary?',
  'Review my career path for the next 2 years',
  'What skills should I learn for a data role?',
];

export default function Coach() {
  return (
    <div className="pa-content">
      <div className="pa-tile" style={{ gap: 14 }}>
        <span className="pa-coach-badge"><span className="material-symbols-outlined fill">smart_toy</span></span>
        <div>
          <h1 className="pa-page-title">AICoach</h1>
          <p className="pa-page-sub" style={{ marginTop: 2 }}>Ask anything about your job search, resume or career</p>
        </div>
      </div>
      <FeatureGate feature="chat">
        <ChatPanel />
      </FeatureGate>
    </div>
  );
}

function ChatPanel() {
  const qc = useQueryClient();
  const toast = useToast();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [input, setInput] = useState('');
  const [streaming, setStreaming] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  const sessions = useQuery({
    queryKey: ['chat-sessions'],
    queryFn: async () => (await api.get<{ sessions: SessionItem[] } | SessionItem[]>('/ai/chat/sessions')).data,
  });
  const sessionList: SessionItem[] = Array.isArray(sessions.data)
    ? sessions.data
    : (sessions.data?.sessions ?? []);

  const openSession = useMutation({
    mutationFn: async (id: string) => (await api.get<{ messages: ChatMsg[] }>(`/ai/chat/sessions/${id}`)).data,
    onSuccess: (data, id) => { setSessionId(id); setMessages(data.messages ?? []); },
    onError: (e) => toast(apiError(e, 'Could not open conversation.')),
  });

  const sendMessage = async (message: string) => {
    const text = message.trim();
    if (!text || streaming) return;
    setInput('');
    setMessages((m) => [...m, { role: 'user', content: text }, { role: 'assistant', content: '' }]);
    setStreaming(true);
    const appendToLast = (chunk: string) =>
      setMessages((m) => {
        const copy = m.slice();
        const last = copy[copy.length - 1];
        if (last && last.role === 'assistant') copy[copy.length - 1] = { ...last, content: last.content + chunk };
        return copy;
      });
    let gotToken = false;
    try {
      const res = await fetch(`${API_URL}/ai/chat/stream`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${tokenStore.getAccess()}` },
        body: JSON.stringify({ message: text, session_id: sessionId ?? undefined }),
      });
      if (!res.ok || !res.body) throw new Error('stream failed');

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buf = '';
      // eslint-disable-next-line no-constant-condition
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });
        const blocks = buf.split('\n\n');
        buf = blocks.pop() ?? '';
        for (const block of blocks) {
          if (!block.trim()) continue;
          let event = 'message';
          let dataStr = '';
          for (const line of block.split('\n')) {
            if (line.startsWith('event:')) event = line.slice(6).trim();
            else if (line.startsWith('data:')) dataStr += line.slice(5).trim();
          }
          if (!dataStr) continue;
          let payload: { text?: string; reply?: string; session_id?: string };
          try { payload = JSON.parse(dataStr); } catch { continue; }
          if (event === 'meta' && payload.session_id) setSessionId(payload.session_id);
          else if (event === 'token' && payload.text) { gotToken = true; appendToLast(payload.text); }
          else if (event === 'done' && !gotToken && payload.reply) appendToLast(payload.reply);
        }
      }
      qc.invalidateQueries({ queryKey: ['chat-sessions'] });
    } catch {
      // Streaming failed (e.g. route not deployed yet) — fall back to the one-shot endpoint
      if (!gotToken) {
        try {
          const data = (await api.post<{ session_id?: string; reply: string }>(
            '/ai/chat', { message: text, session_id: sessionId ?? undefined },
          )).data;
          if (data.session_id) setSessionId(data.session_id);
          appendToLast(data.reply || 'I had trouble responding. Please try again.');
          qc.invalidateQueries({ queryKey: ['chat-sessions'] });
        } catch (e2) {
          setMessages((m) => {
            const copy = m.slice();
            const last = copy[copy.length - 1];
            if (last && last.role === 'assistant' && !last.content) copy.pop();
            return copy;
          });
          toast(apiError(e2, 'Message failed. Try again.'));
        }
      }
    } finally {
      setStreaming(false);
    }
  };

  const remove = useMutation({
    mutationFn: (id: string) => api.delete(`/ai/chat/sessions/${id}`),
    onSuccess: (_d, id) => {
      qc.invalidateQueries({ queryKey: ['chat-sessions'] });
      if (id === sessionId) { setSessionId(null); setMessages([]); }
    },
  });

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, streaming]);

  const submit = () => { sendMessage(input); };
  const newChat = () => { setSessionId(null); setMessages([]); };

  return (
    <div className="pa-chat-layout" style={{ marginTop: 16 }}>
      <aside className="pa-chat-sidebar">
        <Button size="sm" block onClick={newChat}>+ New chat</Button>
        <div style={{ marginTop: 12 }}>
          {sessionList.map((s) => (
            <div key={s.id} className={`pa-chat-session${s.id === sessionId ? ' active' : ''}`}>
              <button className="pa-chat-session-title" onClick={() => openSession.mutate(s.id)}>{s.title || 'Conversation'}</button>
              <button className="pa-chat-session-del" onClick={() => remove.mutate(s.id)} title="Delete">×</button>
            </div>
          ))}
        </div>
      </aside>

      <div className="pa-chat-main pa-card">
        <div className="pa-chat-messages">
          {messages.length === 0 && !streaming && (
            <div className="pa-chat-welcome">
              <div className="pa-coach-orb"><span className="material-symbols-outlined fill" style={{ fontSize: 30 }}>smart_toy</span></div>
              <div style={{ fontWeight: 800, fontSize: 18 }}>AICoach</div>
              <p className="pa-muted" style={{ margin: '6px 0 16px' }}>Start a conversation or pick a prompt:</p>
              {SUGGESTIONS.map((s) => (
                <button key={s} className="pa-chip" style={{ display: 'block', margin: '6px auto', maxWidth: 360 }}
                  onClick={() => sendMessage(s)}>{s}</button>
              ))}
            </div>
          )}
          {messages.map((m, i) => {
            const isAi = m.role !== 'user';
            const isLast = i === messages.length - 1;
            const waiting = streaming && isLast && isAi && !m.content;
            return (
              <div key={i} className={`pa-msg pa-msg-${isAi ? 'ai' : 'user'}`}>
                {isAi && <span className="pa-msg-avatar">✦</span>}
                <div className="pa-msg-bubble">
                  {waiting ? <Spinner size={16} /> : m.content}
                  {streaming && isLast && isAi && m.content && <span className="pa-typing-cursor">▍</span>}
                </div>
              </div>
            );
          })}
          <div ref={endRef} />
        </div>

        <div className="pa-chat-input">
          <textarea className="pa-textarea" rows={1} placeholder="Ask your coach…" value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submit(); } }} />
          <Button loading={streaming} onClick={submit}>Send</Button>
        </div>
      </div>
    </div>
  );
}
