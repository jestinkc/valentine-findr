import { Suspense } from 'react';
import Valentine from '@/components/valentine';

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">Loading...</div>}>
      <Valentine />
    </Suspense>
  );
}
