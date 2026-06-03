import { useEffect, useState } from 'react';

/**
 * Subscribe to the global avatar status broadcast so any component can reflect
 * the assistant's thinking / speaking state for its own project. The avatar
 * (HomeAssistant) dispatches `avatar-status-broadcast` events and mirrors the
 * latest value on `window.currentAvatarState` for late subscribers.
 *
 * Returns `{ projectName, status }` where status is 'idle' | 'thinking' | 'speaking'.
 */
export function useAvatarStatus() {
  const [avatarState, setAvatarState] = useState(
    () => window.currentAvatarState || { projectName: null, status: 'idle', spokenText: null, durationMs: null }
  );

  useEffect(() => {
    const handleBroadcast = (e) => {
      const { projectName, status, spokenText, durationMs } = e.detail;
      setAvatarState({ projectName, status, spokenText, durationMs });
    };

    window.addEventListener('avatar-status-broadcast', handleBroadcast);
    return () => window.removeEventListener('avatar-status-broadcast', handleBroadcast);
  }, []);

  return avatarState;
}
