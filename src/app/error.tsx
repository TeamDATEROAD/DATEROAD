'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('에러 발생:', error);
  }, [error]);

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4">
      <h2 className="text-2xl font-bold text-red-600">오류가 발생했습니다</h2>
      <p className="text-gray-600">{error.message || '알 수 없는 오류가 발생했습니다.'}</p>
      <div className="flex gap-4">
        <Button onClick={() => reset()} variant="outline">
          다시 시도
        </Button>
        <Button onClick={() => window.location.href = '/'}>
          홈으로 이동
        </Button>
      </div>
    </div>
  );
} 