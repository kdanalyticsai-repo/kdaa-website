import { useEffect, useState } from 'react';

interface BIPEvent extends Event { prompt: () => void; userChoice: Promise<{ outcome: string }>; }

const isIos = () => /iphone|ipad|ipod/i.test(navigator.userAgent);
const isStandalone = () =>
  window.matchMedia('(display-mode: standalone)').matches ||
  (navigator as unknown as { standalone?: boolean }).standalone === true;

/**
 * "Install App" button — triggers the PWA install prompt (Android/desktop Chrome).
 * On iOS Safari (no prompt API) it shows the Add-to-Home-Screen instruction.
 * Renders nothing if already installed or not installable.
 */
export function InstallAppButton({ className = 'pa-btn pa-btn-primary pa-btn-sm' }: { className?: string }) {
  const [available, setAvailable] = useState(false);
  const [ios, setIos] = useState(false);

  useEffect(() => {
    if (isStandalone()) return;
    if (isIos()) { setIos(true); setAvailable(true); return; }
    const onAvail = () => setAvailable(true);
    window.addEventListener('pwa-installable', onAvail);
    const onInstalled = () => setAvailable(false);
    window.addEventListener('appinstalled', onInstalled);
    if ((window as unknown as { __pwaPrompt?: unknown }).__pwaPrompt) setAvailable(true);
    return () => {
      window.removeEventListener('pwa-installable', onAvail);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  if (!available) return null;

  const onClick = async () => {
    if (ios) {
      alert('To install ProAICV: tap the Share icon, then "Add to Home Screen".');
      return;
    }
    const w = window as unknown as { __pwaPrompt?: BIPEvent };
    const prompt = w.__pwaPrompt;
    if (!prompt) return;
    prompt.prompt();
    await prompt.userChoice.catch(() => {});
    w.__pwaPrompt = undefined;
    setAvailable(false);
  };

  return (
    <button className={className} onClick={onClick}>
      <span className="material-symbols-outlined" style={{ fontSize: 18 }}>install_mobile</span> Install App
    </button>
  );
}
