import { Suspense } from 'react';
import CelebratePage from '@/components/celebrate-page';

export default function Celebrate() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">Loading...</div>}>
      <CelebratePage />
    </Suspense>
  );
}
