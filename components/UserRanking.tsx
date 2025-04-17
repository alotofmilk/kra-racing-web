import { useEffect, useState } from 'react';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface UserRanking {
  id: string;
  email: string;
  nickname: string;
  totalPoints: number;
  winCount: number;
  totalBets: number;
  winRate: number;
  tier: string;
  tierColor: string;
}

const getTierInfo = (winRate: number): { tier: string; color: string } => {
  if (winRate >= 80) return { tier: '챌린저', color: 'text-yellow-500' };
  if (winRate >= 70) return { tier: '그랜드마스터', color: 'text-red-500' };
  if (winRate >= 60) return { tier: '마스터', color: 'text-purple-500' };
  if (winRate >= 50) return { tier: '다이아몬드', color: 'text-blue-500' };
  if (winRate >= 40) return { tier: '플래티넘', color: 'text-green-500' };
  if (winRate >= 30) return { tier: '골드', color: 'text-yellow-600' };
  if (winRate >= 20) return { tier: '실버', color: 'text-gray-400' };
  return { tier: '브론즈', color: 'text-amber-800' };
};

const UserRanking = () => {
  const [rankings, setRankings] = useState<UserRanking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const q = query(
        collection(db, 'users'),
        orderBy('totalPoints', 'desc'),
        limit(10)
      );

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const rankingsData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as UserRanking[];
          setRankings(rankingsData);
          setLoading(false);
        },
        (error) => {
          console.error('Error fetching rankings:', error);
          setError('랭킹을 불러오는 중 오류가 발생했습니다.');
          setLoading(false);
        }
      );

      return () => unsubscribe();
    } catch (error) {
      console.error('Error setting up listener:', error);
      setError('랭킹을 불러오는 중 오류가 발생했습니다.');
      setLoading(false);
    }
  }, []);

  // 목업 데이터
  const mockRankings: UserRanking[] = [
    {
      id: '1',
      email: 'user1@example.com',
      nickname: '번개마차',
      totalPoints: 150000,
      winCount: 45,
      totalBets: 50,
      winRate: 90,
      tier: '챌린저',
      tierColor: 'text-yellow-500'
    },
    {
      id: '2',
      email: 'user2@example.com',
      nickname: '질주왕',
      totalPoints: 120000,
      winCount: 35,
      totalBets: 50,
      winRate: 70,
      tier: '그랜드마스터',
      tierColor: 'text-red-500'
    },
    {
      id: '3',
      email: 'user3@example.com',
      nickname: '천둥이',
      totalPoints: 100000,
      winCount: 30,
      totalBets: 50,
      winRate: 60,
      tier: '마스터',
      tierColor: 'text-purple-500'
    },
    {
      id: '4',
      email: 'user4@example.com',
      nickname: '바람의속도',
      totalPoints: 80000,
      winCount: 25,
      totalBets: 50,
      winRate: 50,
      tier: '다이아몬드',
      tierColor: 'text-blue-500'
    },
    {
      id: '5',
      email: 'user5@example.com',
      nickname: '구름타기',
      totalPoints: 60000,
      winCount: 20,
      totalBets: 50,
      winRate: 40,
      tier: '플래티넘',
      tierColor: 'text-green-500'
    },
    {
      id: '6',
      email: 'user6@example.com',
      nickname: '별빛마차',
      totalPoints: 40000,
      winCount: 15,
      totalBets: 50,
      winRate: 30,
      tier: '골드',
      tierColor: 'text-yellow-600'
    },
    {
      id: '7',
      email: 'user7@example.com',
      nickname: '달빛마차',
      totalPoints: 30000,
      winCount: 10,
      totalBets: 50,
      winRate: 20,
      tier: '실버',
      tierColor: 'text-gray-400'
    },
    {
      id: '8',
      email: 'user8@example.com',
      nickname: '새벽마차',
      totalPoints: 20000,
      winCount: 5,
      totalBets: 50,
      winRate: 10,
      tier: '브론즈',
      tierColor: 'text-amber-800'
    }
  ];

  const displayRankings = rankings.length > 0 ? rankings : mockRankings;

  return (
    <div className="relative bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 group border border-gray-200">
      <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-white/50 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <div className="relative z-10">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 group-hover:text-primary transition-colors duration-300">유저 랭킹</h2>
        {loading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : displayRankings.length === 0 ? (
          <p className="text-gray-400">랭킹 데이터가 없습니다.</p>
        ) : (
          <div className="space-y-4">
            {displayRankings.map((user, index) => {
              const tierInfo = getTierInfo(user.winRate);
              return (
                <div key={user.id} className="flex items-center justify-between p-3 border-b border-gray-200 hover:bg-gray-50 transition-colors duration-200 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <span className={`text-lg font-semibold ${
                      index === 0 ? 'gradient-text' :
                      index === 1 ? 'gradient-text-2nd' :
                      index === 2 ? 'gradient-text-3rd' :
                      'text-gray-600'
                    }`}>
                      {index + 1}위
                    </span>
                    <div>
                      <p className="font-medium text-gray-800">{user.nickname}</p>
                      <div className="flex items-center space-x-2">
                        <p className="text-sm text-gray-500">
                          승리: {user.winCount || 0}회 | 총 베팅: {user.totalBets || 0}회
                        </p>
                        <span className={`text-sm font-semibold ${tierInfo.color}`}>
                          {tierInfo.tier}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-bold text-primary">
                      {user.totalPoints?.toLocaleString() || 0}점
                    </span>
                    <p className="text-sm text-gray-500">
                      승률: {user.winRate}%
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserRanking; 