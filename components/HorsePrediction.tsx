import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { collection, doc, setDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface Race {
  id: string;
  raceNumber: number;
  raceName: string;
  startTime: string;
  horses: {
    number: number;
    name: string;
    odds: number;
  }[];
}

type BetType = 'single' | 'quinella' | 'exacta' | 'trio' | 'trifecta' | 'double' | 'triple';

const HorsePrediction = () => {
  const { user } = useAuth();
  const [selectedRace, setSelectedRace] = useState<Race | null>(null);
  const [selectedHorses, setSelectedHorses] = useState<number[]>([]);
  const [betAmount, setBetAmount] = useState<string>('');
  const [betType, setBetType] = useState<BetType>('single');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const races: Race[] = [
    {
      id: '1',
      raceNumber: 1,
      raceName: '서울경마장 1R',
      startTime: '2024-03-17 13:00',
      horses: [
        { number: 1, name: '번개', odds: 3.5 },
        { number: 2, name: '질주', odds: 2.8 },
        { number: 3, name: '쾌속', odds: 2.5 },
        { number: 4, name: '천둥', odds: 3.2 },
        { number: 5, name: '바람', odds: 2.9 },
        { number: 6, name: '구름', odds: 3.0 },
        { number: 7, name: '번개', odds: 3.0 },
        { number: 8, name: '별', odds: 3.8 }
      ]
    },
    {
      id: '2',
      raceNumber: 2,
      raceName: '서울경마장 2R',
      startTime: '2024-03-17 13:30',
      horses: [
        { number: 1, name: '번개', odds: 3.5 },
        { number: 2, name: '질주', odds: 2.8 },
        { number: 3, name: '쾌속', odds: 2.5 },
        { number: 4, name: '천둥', odds: 3.2 },
        { number: 5, name: '바람', odds: 2.9 },
        { number: 6, name: '구름', odds: 3.0 },
        { number: 7, name: '번개', odds: 3.0 },
        { number: 8, name: '별', odds: 3.8 }
      ]
    },
    {
      id: '3',
      raceNumber: 3,
      raceName: '서울경마장 3R',
      startTime: '2024-03-17 14:00',
      horses: [
        { number: 1, name: '번개', odds: 3.5 },
        { number: 2, name: '질주', odds: 2.8 },
        { number: 3, name: '쾌속', odds: 2.5 },
        { number: 4, name: '천둥', odds: 3.2 },
        { number: 5, name: '바람', odds: 2.9 },
        { number: 6, name: '구름', odds: 3.0 },
        { number: 7, name: '번개', odds: 3.0 },
        { number: 8, name: '별', odds: 3.8 }
      ]
    }
  ];

  const handleHorseSelect = (horseNumber: number) => {
    if (!selectedRace) return;

    // 이미 선택된 말인 경우 선택 해제
    if (selectedHorses.includes(horseNumber)) {
      setSelectedHorses(selectedHorses.filter(num => num !== horseNumber));
      return;
    }

    // 선택 가능한 말 수 체크
    let maxHorses = 1;
    switch (betType) {
      case 'single':
        maxHorses = 1; // 단승: 1마리
        break;
      case 'quinella':
        maxHorses = 1; // 연승: 1마리
        break;
      case 'exacta':
        maxHorses = 2; // 복승: 2마리
        break;
      case 'double':
        maxHorses = 2; // 쌍승: 2마리
        break;
      case 'trio':
        maxHorses = 2; // 복연승: 2마리
        break;
      case 'trifecta':
        maxHorses = 3; // 삼복승: 3마리
        break;
      case 'triple':
        maxHorses = 3; // 삼쌍승: 3마리
        break;
    }

    if (selectedHorses.length >= maxHorses) {
      setError(`최대 ${maxHorses}마리까지만 선택 가능합니다.`);
      return;
    }

    setSelectedHorses([...selectedHorses, horseNumber]);
    setError('');
  };

  const handleBet = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError('로그인이 필요합니다.');
      return;
    }

    if (!selectedRace || selectedHorses.length === 0 || !betAmount) {
      setError('모든 정보를 입력해주세요.');
      return;
    }

    try {
      const predictionRef = doc(collection(db, 'predictions'));
      const predictionData = {
        userId: user.uid,
        raceId: selectedRace.id,
        raceNumber: selectedRace.raceNumber,
        raceName: selectedRace.raceName,
        selectedHorses: selectedHorses,
        betType: betType,
        amount: Number(betAmount),
        timestamp: serverTimestamp(),
        status: 'pending',
        startTime: selectedRace.startTime
      };

      await setDoc(predictionRef, predictionData);

      // 5초 후 결과 결정
      setTimeout(async () => {
        const result = Math.random() < 0.5 ? 'won' : 'lost';
        await updateDoc(predictionRef, {
          status: result,
          updatedAt: serverTimestamp()
        });
      }, 5000);

      setSelectedHorses([]);
      setBetAmount('');
      setError(null);
      setSuccess('베팅이 완료되었습니다. 결과는 잠시 후 확인할 수 있습니다.');
    } catch (error) {
      console.error('Error saving prediction:', error);
      setError('베팅 저장 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-lg shadow transition-all duration-300 hover:shadow-lg hover:scale-[1.01]">
        <h3 className="text-lg font-semibold mb-4">경기 선택</h3>
        <select
          value={selectedRace?.id || ''}
          onChange={(e) => {
            const race = races.find(r => r.id === e.target.value);
            setSelectedRace(race || null);
            setSelectedHorses([]);
            setError(null);
            setSuccess(null);
          }}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        >
          <option value="">경기를 선택하세요</option>
          {races.map(race => (
            <option key={race.id} value={race.id}>
              {race.raceName} - {new Date(race.startTime).toLocaleString()}
            </option>
          ))}
        </select>
      </div>

      <form onSubmit={handleBet} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}
        {success && (
          <div className="p-3 bg-green-100 text-green-700 rounded">
            {success}
          </div>
        )}
        <div className="bg-white p-6 rounded-lg shadow transition-all duration-300 hover:shadow-lg hover:scale-[1.01]">
          <h3 className="text-lg font-semibold mb-4">승식 선택</h3>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setBetType('single')}
              className={`py-2 px-4 rounded-md transition-all duration-300 ${
                betType === 'single'
                  ? 'gradient-button text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              단승
            </button>
            <button
              type="button"
              onClick={() => setBetType('quinella')}
              className={`py-2 px-4 rounded-md transition-all duration-300 ${
                betType === 'quinella'
                  ? 'gradient-button text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              연승
            </button>
            <button
              type="button"
              onClick={() => setBetType('exacta')}
              className={`py-2 px-4 rounded-md transition-all duration-300 ${
                betType === 'exacta'
                  ? 'gradient-button text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              복승
            </button>
            <button
              type="button"
              onClick={() => setBetType('trio')}
              className={`py-2 px-4 rounded-md transition-all duration-300 ${
                betType === 'trio'
                  ? 'gradient-button text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              복연승
            </button>
            <button
              type="button"
              onClick={() => setBetType('trifecta')}
              className={`py-2 px-4 rounded-md transition-all duration-300 ${
                betType === 'trifecta'
                  ? 'gradient-button text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              삼복승
            </button>
            <button
              type="button"
              onClick={() => setBetType('double')}
              className={`py-2 px-4 rounded-md transition-all duration-300 ${
                betType === 'double'
                  ? 'gradient-button text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              쌍승
            </button>
            <button
              type="button"
              onClick={() => setBetType('triple')}
              className={`py-2 px-4 rounded-md transition-all duration-300 ${
                betType === 'triple'
                  ? 'gradient-button text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              삼쌍승
            </button>
          </div>
        </div>

        {selectedRace && (
          <div className="bg-white p-6 rounded-lg shadow transition-all duration-300 hover:shadow-lg hover:scale-[1.01]">
            <h3 className="text-lg font-semibold mb-4">말 선택</h3>
            <div className="grid grid-cols-4 gap-2">
              {selectedRace.horses.map((horse) => (
                <button
                  key={horse.number}
                  onClick={() => handleHorseSelect(horse.number)}
                  className={`p-3 rounded-md transition-all duration-300 ${
                    selectedHorses.includes(horse.number)
                      ? 'gradient-button text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-lg font-bold">{horse.number}번</div>
                    <div className="text-sm">{horse.name}</div>
                    <div className="text-sm text-red-500">{horse.odds.toFixed(1)}배</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="bg-white p-6 rounded-lg shadow transition-all duration-300 hover:shadow-lg hover:scale-[1.01]">
          <h3 className="text-lg font-semibold mb-4">배팅 금액</h3>
          <input
            type="number"
            value={betAmount}
            onChange={(e) => {
              setBetAmount(e.target.value);
              setError(null);
              setSuccess(null);
            }}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="배팅 금액을 입력하세요"
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 px-4 gradient-button text-white rounded-md transition-all duration-300"
        >
          배팅하기
        </button>
      </form>
    </div>
  );
};

export default HorsePrediction;