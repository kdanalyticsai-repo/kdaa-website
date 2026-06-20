import { useState, useRef, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api, apiError } from '@/app/lib/api';
import { Button, Spinner, useToast } from '@/app/components/ui';
import { FeatureGate } from '@/app/components/FeatureGate';

interface ChatMsg { role: string; content: string }
interface ChatResponse { session_title: string; reply: string; messages: ChatMsg[] }
interface SessionItem { id: string; title: string }

const SUGGESTIONS = [
  'How do I negotiate a higher salary?',
  'Review my career path for the next 2 years',
  'What skills should I learn for a data role?',
];

export default function Coach() {
  return (
    <div className="pa-content">
      <h1 className="pa-page-title">Career coach</h1>
      <p className="pa-page-sub">Ask anything about your job search, resume or career</p>
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

  const send = useMutation({
    mutationFn: async (message: string) =>
      (await api.post<ChatResponse>('/ai/chat', { message, session_id: sessionId ?? undefined })).data,
    onMutate: (message) => {
      setMessages((m) => [...m, { role: 'user', content: message }]);
      setInput('');
    },
    onSuccess: (data) => {
      setMessages(data.messages ?? []);
      qc.invalidateQueries({ queryKey: ['chat-sessions'] });
    },
    onError: (e) => { toast(apiError(e, 'Message failed. Try again.')); },
  });

  const remove = useMutation({
    mutationFn: (id: string) => api.delete(`/ai/chat/sessions/${id}`),
    onSuccess: (_d, id) => {
      qc.invalidateQueries({ queryKey: ['chat-sessions'] });
      if (id === sessionId) { setSessionId(null); setMessages([]); }
    },
  });

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, send.isPending]);

  const submit = () => { const t = input.trim(); if (t && !send.isPending) send.mutate(t); };
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
          {messages.length === 0 && !send.isPending && (
            <div className="pa-chat-welcome">
              <div className="pa-coach-orb">✦</div>
              <div style={{ fontWeight: 800, fontSize: 18 }}>AI Career Coach</div>
              <p className="pa-muted" style={{ margin: '6px 0 16px' }}>Start a conversation or pick a prompt:</p>
              {SUGGESTIONS.map((s) => (
                <button key={s} className="pa-chip" style={{ display: 'block', margin: '6px auto', maxWidth: 360 }}
                  onClick={() => send.mutate(s)}>{s}</button>
              ))}
            </div>
          )}
          {messages.map((m, i) => (
            <div key={i} className={`pa-msg pa-msg-${m.role === 'user' ? 'user' : 'ai'}`}>
              {m.role !== 'user' && <span className="pa-msg-avatar">✦</span>}
              <div className="pa-msg-bubble">{m.content}</div>
            </div>
          ))}
          {send.isPending && (
            <div className="pa-msg pa-msg-ai"><span className="pa-msg-avatar">✦</span><div className="pa-msg-bubble"><Spinner size={16} /></div></div>
          )}
          <div ref={endRef} />
        </div>

        <div className="pa-chat-input">
          <textarea className="pa-textarea" rows={1} placeholder="Ask your coach…" value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submit(); } }} />
          <Button loading={send.isPending} onClick={submit}>Send</Button>
        </div>
      </div>
    </div>
  );
}
