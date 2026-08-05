import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { InterviewSession } from '../types';

export function useInterviewRealtime(sessionId: string | undefined, userId: string | undefined) {
  const [processingStatus, setProcessingStatus] = useState<string | null>(null);
  const [sessionPatch, setSessionPatch] = useState<Partial<InterviewSession> | null>(null);

  useEffect(() => {
    if (!sessionId || !userId) return;

    const channel = supabase
      .channel(`interview-${sessionId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'interview_sessions',
          filter: `id=eq.${sessionId}`,
        },
        (payload) => {
          const row = payload.new as InterviewSession;
          if (row.user_id && row.user_id !== userId) return;
          setProcessingStatus(row.processing_status || null);
          setSessionPatch(row);
        }
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [sessionId, userId]);

  return { processingStatus, sessionPatch };
}
