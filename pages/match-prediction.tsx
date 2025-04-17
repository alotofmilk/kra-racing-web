import { useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';
import HorsePrediction from '../components/HorsePrediction';
import PredictionHistory from '../components/PredictionHistory';

const MatchPrediction = () => {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState<'bet' | 'history'>('bet');

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
    <div className="min-h-screen bg-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex space-x-4">
            <button
              onClick={() => setActiveTab('bet')}
              className={`px-4 py-2 rounded-md font-medium transition-all duration-300 ${
                activeTab === 'bet'
                  ? 'gradient-button hover:shadow-lg hover:shadow-red-500/20 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              베팅하기
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-4 py-2 rounded-md font-medium transition-all duration-300 ${
                activeTab === 'history'
                  ? 'gradient-button hover:shadow-lg hover:shadow-red-500/20 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              베팅 기록
            </button>
          </div>
          <button
            onClick={() => router.push('/')}
            className="gradient-button py-2 px-4 rounded-md font-medium transition-all duration-300 hover:shadow-lg hover:shadow-red-500/20 text-white"
          >
            홈으로
          </button>
        </div>

        {activeTab === 'bet' ? <HorsePrediction /> : <PredictionHistory />}
      </div>
    </div>
  );
};

export default MatchPrediction; 