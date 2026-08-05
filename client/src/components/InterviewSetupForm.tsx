import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { interviewSetupFormSchema } from '../lib/validation';
import {
  TARGET_ROLES,
  TOPICS_BY_ROLE,
  INTERVIEW_TYPES,
  DIFFICULTIES,
  QUESTION_COUNTS,
} from '../types';
import { ErrorAlert } from './ErrorAlert';
import { RoleSelector } from './RoleSelector';
import { TopicSelector } from './TopicSelector';
import { DifficultySelector } from './DifficultySelector';
import { QuestionCountSelector } from './QuestionCountSelector';

type FormData = z.infer<typeof interviewSetupFormSchema>;

type Props = {
  defaultRole?: string;
  defaultDifficulty?: string;
  onSubmit: (data: FormData) => Promise<void>;
  error?: string | null;
};

export function InterviewSetupForm({ defaultRole, defaultDifficulty, onSubmit, error }: Props) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(interviewSetupFormSchema),
    defaultValues: {
      target_role: (defaultRole as FormData['target_role']) || 'Full-Stack Developer',
      interview_type: 'Technical',
      topic: '',
      difficulty: (defaultDifficulty as FormData['difficulty']) || 'Easy',
      total_questions: 3,
    },
  });

  const role = watch('target_role');
  const topics = useMemo(() => TOPICS_BY_ROLE[role] || [], [role]);

  useEffect(() => {
    if (topics.length && !topics.includes(watch('topic'))) {
      setValue('topic', topics[0]);
    }
  }, [topics, setValue, watch]);

  return (
    <form
      onSubmit={handleSubmit(async (data) => onSubmit(data))}
      className="space-y-6 rounded-2xl border border-border bg-card p-6 shadow-sm"
    >
      {error && <ErrorAlert message={error} />}

      <RoleSelector
        value={role}
        options={[...TARGET_ROLES]}
        onChange={(v) => setValue('target_role', v as FormData['target_role'])}
      />

      <div>
        <label className="mb-2 block text-sm font-medium">Interview type</label>
        <div className="flex flex-wrap gap-2">
          {INTERVIEW_TYPES.map((type) => (
            <label key={type} className="cursor-pointer">
              <input type="radio" value={type} className="peer sr-only" {...register('interview_type')} />
              <span className="inline-block rounded-full border border-border px-4 py-2 text-sm peer-checked:border-accent peer-checked:bg-accent peer-checked:text-white">
                {type}
              </span>
            </label>
          ))}
        </div>
      </div>

      <TopicSelector
        value={watch('topic')}
        options={topics}
        onChange={(v) => setValue('topic', v, { shouldValidate: true })}
        error={errors.topic?.message}
      />

      <DifficultySelector
        value={watch('difficulty')}
        options={[...DIFFICULTIES]}
        onChange={(v) => setValue('difficulty', v as FormData['difficulty'])}
      />

      <QuestionCountSelector
        value={Number(watch('total_questions'))}
        options={[...QUESTION_COUNTS]}
        onChange={(v) => setValue('total_questions', v)}
      />

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-xl bg-accent py-3 text-sm font-semibold text-white hover:bg-accent-dark disabled:opacity-60 sm:w-auto sm:px-8"
      >
        {isSubmitting ? 'Starting interview…' : 'Start mock interview'}
      </button>
    </form>
  );
}
