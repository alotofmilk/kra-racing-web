import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface Match {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeOdds: number;
  drawOdds: number;
  awayOdds: number;
  startTime: string;
}

const MatchPrediction = () => {
  const { user } = useAuth();
  const [selectedMatch, setSelectedMatch] = useState<string | null>(null);
  const [selectedPrediction, setSelectedPrediction] = useState<'home' | 'draw' | 'away' | null>(null);
  const [betAmount, setBetAmount] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // 목업 경기 데이터
  const matches: Match[] = [
    {
      id: '1',
      homeTeam: '맨체스터 유나이티드',
      awayTeam: '리버풀',
      homeOdds: 2.5,
      drawOdds: 3.2,
      awayOdds: 2.8,
      startTime: '2024-03-17 21:00'
    },
    {
      id: '2',
      homeTeam: '바르셀로나',
      awayTeam: '레알 마드리드',
      homeOdds: 2.1,
      drawOdds: 3.5,
      awayOdds: 3.2,
      startTime: '2024-03-18 02:00'
    },
    {
      id: '3',
      homeTeam: '토트넘',
      awayTeam: '아스날',
      homeOdds: 2.8,
      drawOdds: 3.3,
      awayOdds: 2.5,
      startTime: '2024-03-19 20:00'
    }
  ];

  const handleBet = async () => {
    if (!user) {
      setError('로그인이 필요합니다.');
      return;
    }

    if (!selectedMatch || !selectedPrediction) {
      setError('경기와 예측을 선택해주세요.');
      return;
    }

    const amount = parseInt(betAmount);
    if (isNaN(amount) || amount <= 0) {
      setError('유효한 금액을 입력해주세요.');
      return;
    }

    try {
      const match = matches.find(m => m.id === selectedMatch);
      if (!match) {
        setError('선택한 경기를 찾을 수 없습니다.');
        return;
      }

      const odds = selectedPrediction === 'home' ? match.homeOdds :
                  selectedPrediction === 'draw' ? match.drawOdds :
                  match.awayOdds;

      await addDoc(collection(db, 'predictions'), {
        userId: user.uid,
        matchId: match.id,
        homeTeam: match.homeTeam,
        awayTeam: match.awayTeam,
        prediction: selectedPrediction,
        amount: amount,
        odds: odds,
        timestamp: Timestamp.now(),
        status: 'pending',
        startTime: match.startTime
      });

      setSuccess('예측이 성공적으로 완료되었습니다!');
      setSelectedMatch(null);
      setSelectedPrediction(null);
      setBetAmount('');
      setError(null);
    } catch (error) {
      console.error('Error placing prediction:', error);
      setError('예측 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">승부예측</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}
      
      {success && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
          {success}
        </div>
      )}

      <div className="space-y-4 mb-6">
        {matches.map((match) => (
          <div
            key={match.id}
            className={`p-4 rounded-lg border ${
              selectedMatch === match.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200'
            }`}
          >
            <div className="flex justify-between items-center mb-2">
              <div className="text-sm text-gray-500">
                {new Date(match.startTime).toLocaleString()}
              </div>
              <button
                onClick={() => {
                  setSelectedMatch(match.id);
                  setError(null);
                  setSuccess(null);
                }}
                className="text-blue-500 hover:text-blue-700"
              >
                선택
              </button>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className={`p-2 rounded ${
                selectedMatch === match.id && selectedPrediction === 'home'
                  ? 'bg-blue-100'
                  : 'bg-gray-50'
              }`}>
                <p className="font-medium">{match.homeTeam}</p>
                <p className="text-blue-600 font-semibold">{match.homeOdds}배</p>
                <button
                  onClick={() => {
                    setSelectedMatch(match.id);
                    setSelectedPrediction('home');
                    setError(null);
                    setSuccess(null);
                  }}
                  className="mt-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  홈 승
                </button>
              </div>
              <div className={`p-2 rounded ${
                selectedMatch === match.id && selectedPrediction === 'draw'
                  ? 'bg-blue-100'
                  : 'bg-gray-50'
              }`}>
                <p className="font-medium">무승부</p>
                <p className="text-blue-600 font-semibold">{match.drawOdds}배</p>
                <button
                  onClick={() => {
                    setSelectedMatch(match.id);
                    setSelectedPrediction('draw');
                    setError(null);
                    setSuccess(null);
                  }}
                  className="mt-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  무승부
                </button>
              </div>
              <div className={`p-2 rounded ${
                selectedMatch === match.id && selectedPrediction === 'away'
                  ? 'bg-blue-100'
                  : 'bg-gray-50'
              }`}>
                <p className="font-medium">{match.awayTeam}</p>
                <p className="text-blue-600 font-semibold">{match.awayOdds}배</p>
                <button
                  onClick={() => {
                    setSelectedMatch(match.id);
                    setSelectedPrediction('away');
                    setError(null);
                    setSuccess(null);
                  }}
                  className="mt-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  어웨이 승
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 mb-2">베팅 금액</label>
        <input
          type="number"
          value={betAmount}
          onChange={(e) => {
            setBetAmount(e.target.value);
            setError(null);
            setSuccess(null);
          }}
          placeholder="베팅할 금액을 입력하세요"
          className="w-full p-2 border rounded"
        />
      </div>

      <button
        onClick={handleBet}
        disabled={!selectedMatch || !selectedPrediction || !betAmount}
        className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
      >
        예측하기
      </button>
    </div>
  );
};

export default MatchPrediction; 