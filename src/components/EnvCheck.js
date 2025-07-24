'use client';

import { useEffect, useState } from 'react';

export default function EnvCheck() {
  const [envStatus, setEnvStatus] = useState({
    supabaseUrl: false,
    supabaseKey: false,
    isComplete: false
  });

  useEffect(() => {
    const checkEnv = () => {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      
      const status = {
        supabaseUrl: !!supabaseUrl,
        supabaseKey: !!supabaseKey,
        isComplete: !!(supabaseUrl && supabaseKey)
      };
      
      setEnvStatus(status);
      
      if (!status.isComplete) {
        console.error('❌ Environment variables missing:', {
          supabaseUrl: supabaseUrl ? 'Set' : 'Missing',
          supabaseKey: supabaseKey ? 'Set' : 'Missing'
        });
      } else {
        console.log('✅ Environment variables loaded successfully');
      }
    };

    checkEnv();
  }, []);

  // 개발 환경에서만 표시
  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  if (envStatus.isComplete) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 bg-red-500 text-white p-4 rounded-lg shadow-lg z-50 max-w-sm">
      <h3 className="font-bold mb-2">⚠️ Environment Variables Missing</h3>
      <div className="text-sm space-y-1">
        <div>Supabase URL: {envStatus.supabaseUrl ? '✅' : '❌'}</div>
        <div>Supabase Key: {envStatus.supabaseKey ? '✅' : '❌'}</div>
      </div>
      <p className="text-xs mt-2 opacity-90">
        Check your .env.local file or Vercel environment variables
      </p>
    </div>
  );
} 