import { useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';
import HorseRacing from '../components/HorseRacing';
import UserRanking from '../components/UserRanking';
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState<'racing' | 'ranking'>('racing');

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    router.push('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="relative h-[400px] w-full overflow-hidden">
        <Image
          src="/images/main.jpeg"
          alt="KRA Hero"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/60"></div>
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-white to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent"></div>
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
          <h1 className="text-7xl font-bold text-white mb-4 tracking-wider" style={{ fontFamily: 'SDKukdetopokki, serif' }}>
            KOREA CUP
          </h1>
          <h2 className="text-6xl font-bold text-white tracking-wider" style={{ fontFamily: 'SDKukdetopokki, serif' }}>
            & KOREA SPRINT
          </h2>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4 md:p-8 pt-16 md:pt-24">
        <div className="mb-16">
          <div className="relative bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 group border border-gray-200">
            <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-white/50 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <h2 className="text-2xl font-bold mb-4 text-gray-800 group-hover:text-primary transition-colors duration-300">모의 베팅</h2>
              <p className="text-gray-600 mb-6">경마 예측을 통해 포인트를 획득하세요!</p>
              <Link href="/match-prediction">
                <button className="w-full py-4 px-6 text-white rounded-lg font-semibold text-lg shadow-md hover:shadow-lg gradient-button">
                  모의 베팅 시작하기
                </button>
              </Link>
            </div>
          </div>
        </div>

        <div className="flex space-x-4 mb-12">
          <button
            onClick={() => setActiveTab('racing')}
            className={`px-6 py-3 rounded-lg transition-colors duration-300 ${
              activeTab === 'racing'
                ? 'gradient-button text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            경마 정보
          </button>
          <button
            onClick={() => setActiveTab('ranking')}
            className={`px-6 py-3 rounded-lg transition-colors duration-300 ${
              activeTab === 'ranking'
                ? 'gradient-button text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            사용자 랭킹
          </button>
        </div>

        <div className="mb-12">
          {activeTab === 'racing' ? <HorseRacing /> : <UserRanking />}
        </div>
      </div>
    </div>
  );
} 