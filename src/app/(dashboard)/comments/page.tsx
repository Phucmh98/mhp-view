'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function CommentsPage() {
  const router = useRouter();

  useEffect(() => {
    // Tự động redirect đến all-comments khi vào trang comments
    router.push('/comments/all-comments');
  }, [router]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Redirecting...</h1>
      <p>Redirecting to all comments...</p>
    </div>
  );
}
