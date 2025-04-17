import { useState } from 'react';
import ShareButton from '../components/ShareButton';

interface Ranking {
  id: number;
  name: string;
  winRate: number;
  totalBets: number;
  profit: number;
}

export default function Ranking() {
  const [rankings] = useState<Ranking[]>([
    {
      id: 1,
      name: "홍길동",
      winRate: 75.5,
      totalBets: 120,
      profit: 2500000
    },
    {
      id: 2,
      name: "김철수",
      winRate: 68.2,
      totalBets: 95,
      profit: 1800000
    },
    {
      id: 3,
      name: "이영희",
      winRate: 62.8,
      totalBets: 150,
      profit: 1500000
    },
    {
      id: 4,
      name: "박민수",
      winRate: 58.3,
      totalBets: 85,
      profit: 1200000
    },
    {
      id: 5,
      name: "최지원",
      winRate: 55.7,
      totalBets: 110,
      profit: 950000
    },
    {
      id: 6,
      name: "정현우",
      winRate: 52.1,
      totalBets: 75,
      profit: 800000
    },
    {
      id: 7,
      name: "강서연",
      winRate: 48.9,
      totalBets: 130,
      profit: 650000
    },
    {
      id: 8,
      name: "윤도현",
      winRate: 45.2,
      totalBets: 90,
      profit: 500000
    }
  ]);

  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareTitle = "경마 예측 랭킹";
  const shareDescription = `현재 1위: ${rankings[0].name} (승률 ${rankings[0].winRate}%)`;

  return (
    <div className="min-h-screen bg-gray-100 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-black" style={{ fontFamily: 'SDKukdetopokki, serif' }}>
               
          </h1>
          <ShareButton
            title={shareTitle}
            description={shareDescription}
            url={currentUrl}
          />
        </div>
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">순위</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">이름</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">승률</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">총 배팅</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">수익</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {rankings.map((ranking, index) => (
                <tr key={ranking.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{index + 1}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{ranking.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{ranking.winRate}%</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{ranking.totalBets}회</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{ranking.profit.toLocaleString()}원</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 