/* eslint-disable @typescript-eslint/no-explicit-any */

'use client';
import { useNotion } from '../context/NotionContext';
import { useRouter } from 'next/navigation';

export default function Home() {
  const { subjectOptions } = useNotion();

  const router = useRouter();
  const routeToQuizPage = (index: number) => {
    router.push(`/quiz/${index}`);
  };

  return (
    <div className='grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]'>
      <main className='flex flex-col gap-[32px] row-start-2 items-center sm:items-start'>
        {subjectOptions?.map((option: any) => (
          <button
            className='flex flex-col bg-slate-100 rounded-lg pushable font-sans text-4xl'
            key={option.id}
            onClick={() => routeToQuizPage(option.id)}
          >
            <span className='front'>{option.name}</span>
          </button>
        ))}
      </main>
    </div>
  );
}
