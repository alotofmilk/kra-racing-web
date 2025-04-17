import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import HorseRacing from '../components/HorseRacing';
import BettingHistory from '../components/BettingHistory';

const HorseRacingPage = () => {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">경마 베팅</h1>
          <button
            onClick={() => router.push('/')}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            홈으로 돌아가기
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <HorseRacing />
          <BettingHistory />
        </div>
      </div>
    </div>
  );
};

export default HorseRacingPage; 