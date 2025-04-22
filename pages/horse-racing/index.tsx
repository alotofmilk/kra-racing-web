import { NextPage } from 'next';
import Head from 'next/head';
import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import BettingHistory from '../../components/BettingHistory';

const HorseRacing: NextPage = () => {
  const { user } = useAuth();
  const [selectedHorse, setSelectedHorse] = useState<number | null>(null);
  const [betAmount, setBetAmount] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [userPoints, setUserPoints] = useState<number>(10000); // 초기 포인트 10,000원

  // 임시 데이터 - 실제로는 API에서 가져올 예정
  const races = [
    {
      id: 1,
      time: '14:00',
      horses: [
        { number: 1, name: '번개', odds: 2.5 },
        { number: 2, name: '천둥', odds: 3.0 },
        { number: 3, name: '별', odds: 4.0 },
      ]
    }
  ];

  const handleBet = async () => {
    if (!user) {
      setError('로그인이 필요합니다.');
      return;
    }

    if (!selectedHorse || !betAmount) {
      setError('마와 베팅 금액을 선택해주세요.');
      return;
    }

    const amount = parseInt(betAmount);
    if (isNaN(amount) || amount <= 0) {
      setError('유효한 금액을 입력해주세요.');
      return;
    }

    if (amount > userPoints) {
      setError('보유 포인트가 부족합니다.');
      return;
    }

    try {
      const selectedHorseData = races[0].horses.find(h => h.number === selectedHorse);
      if (!selectedHorseData) {
        setError('선택한 마 정보를 찾을 수 없습니다.');
        return;
      }

      await addDoc(collection(db, 'bets'), {
        userId: user.uid,
        horseNumber: selectedHorseData.number,
        horseName: selectedHorseData.name,
        amount: amount,
        odds: selectedHorseData.odds,
        timestamp: serverTimestamp(),
        status: 'pending'
      });

      // 포인트 차감 (실제로는 트랜잭션으로 처리해야 함)
      setUserPoints(prev => prev - amount);
      setBetAmount('');
      setSelectedHorse(null);
      setError(null);
    } catch (error) {
      setError('베팅 중 오류가 발생했습니다.');
      console.error('Betting error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Head>
        <title>경마 베팅</title>
        <meta name="description" content="경마 베팅 서비스" />
      </Head>

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">경마 베팅</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 경주 정보 및 베팅 폼 */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">오늘의 경주</h2>
              {races.map(race => (
                <div key={race.id} className="mb-6">
                  <h3 className="text-lg font-medium mb-4">경주 {race.time}</h3>
                  <div className="space-y-2">
                    {race.horses.map(horse => (
                      <div 
                        key={horse.number}
                        className={`p-3 rounded border cursor-pointer ${
                          selectedHorse === horse.number ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                        }`}
                        onClick={() => setSelectedHorse(horse.number)}
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{horse.number}번 {horse.name}</span>
                          <span className="text-blue-600">배당률: {horse.odds}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">베팅하기</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    보유 포인트: {userPoints.toLocaleString()}원
                  </label>
                  <input
                    type="number"
                    value={betAmount}
                    onChange={(e) => setBetAmount(e.target.value)}
                    className="w-full p-2 border rounded"
                    placeholder="베팅할 금액을 입력하세요"
                  />
                </div>
                {error && (
                  <div className="text-red-500 text-sm">{error}</div>
                )}
                <button
                  onClick={handleBet}
                  disabled={!selectedHorse || !betAmount}
                  className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:bg-gray-300"
                >
                  베팅하기
                </button>
              </div>
            </div>
          </div>

          {/* 배팅 내역 */}
          <div className="lg:col-span-1">
            <BettingHistory />
          </div>
        </div>
      </main>
    </div>
  );
};

export default HorseRacing; 