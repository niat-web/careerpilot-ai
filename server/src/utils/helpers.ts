/**
 * Lightweight helpers kept testable without a full server boot.
 */
export function averageScore(scores: number[]): number | null {
  if (!scores.length) return null;
  const sum = scores.reduce((a, b) => a + b, 0);
  return Math.round((sum / scores.length) * 10) / 10;
}

export function clampAnswerLength(answer: string, max = 5000): string {
  return answer.slice(0, max);
}

export function isProcessingBusy(status?: string | null): boolean {
  return [
    'generating_question',
    'evaluating_answer',
    'generating_feedback',
    'saving_result',
  ].includes(status || '');
}
