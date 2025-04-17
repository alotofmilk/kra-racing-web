import { useEffect, useState } from 'react';
import { collection, query, where, orderBy, onSnapshot, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';

interface Prediction {
  id: string;
  userId: string;
  raceId: string;
  raceNumber: number;
  raceName: string;
  selectedHorses: number[];
  betType: string;
  amount: number;
  timestamp: any;
  status: string;
  startTime: string;
  resultTime?: any;
}

const getBetTypeName = (type: string): string => {
  switch (type) {
    case 'single':
      return '단승';
    case 'quinella':
      return '연승';
    case 'exacta':
      return '복승';
    case 'trio':
      return '복연승';
    case 'trifecta':
      return '삼복승';
    case 'double':
      return '쌍승';
    case 'triple':
      return '삼쌍승';
    default:
      return type;
  }
};

const PredictionHistory = () => {
  const { user } = useAuth();
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'predictions'),
      where('userId', '==', user.uid),
      orderBy('timestamp', 'desc')
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        console.log('[🔥 예측 데이터 수신됨] 문서 수:', snapshot.size);
        const predictionsData = snapshot.docs.map(doc => {
          const data = doc.data();
          console.log('[📄 문서 데이터]', {
            id: doc.id,
            status: data.status,
            timestamp: data.timestamp?.toDate(),
            updatedAt: data.updatedAt?.toDate()
          });
          return {
            id: doc.id,
            ...data,
            selectedHorses: data.selectedHorses || []
          };
        }) as Prediction[];
        setPredictions(predictionsData);
        setLoading(false);
      },
      (error) => {
        console.error('[❌ 예측 데이터 수신 실패]', error);
        setError('예측 기록을 불러오는 중 오류가 발생했습니다.');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  const handleDelete = async (id: string) => {
    if (!user) return;

    setDeletingId(id);
    try {
      await deleteDoc(doc(db, 'predictions', id));
    } catch (error) {
      console.error('Error deleting prediction:', error);
      setError('예측 기록을 삭제하는 중 오류가 발생했습니다.');
    } finally {
      setDeletingId(null);
    }
  };

  // 목업 데이터
  const mockPredictions: Prediction[] = [
    {
      id: '1',
      userId: 'mock-user',
      raceId: '1',
      raceNumber: 3,
      raceName: '서울경마장 3R',
      selectedHorses: [1],
      betType: 'single',
      amount: 6000,
      timestamp: { toDate: () => new Date('2025-04-13T14:05:47') },
      status: 'won',
      startTime: '2025-04-13 14:05:47'
    }
  ];

  const displayPredictions = predictions.length > 0 ? predictions : mockPredictions;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-500';
      case 'won': return 'text-green-500';
      case 'lost': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return '진행중';
      case 'won': return '적중';
      case 'lost': return '실패';
      default: return status;
    }
  };

  if (loading) {
    return (
      <div className="relative bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 group border border-gray-200">
        <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-white/50 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="relative z-10">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 group-hover:text-primary transition-colors duration-300">베팅 기록</h2>
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 group border border-gray-200">
      <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-white/50 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <div className="relative z-10">
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="text-red-500 text-center py-4">{error}</div>
        ) : predictions.length === 0 ? (
          <div className="text-gray-500 text-center py-8">베팅 기록이 없습니다.</div>
        ) : (
          <div className="space-y-4">
            {predictions.map((prediction) => (
              <div
                key={prediction.id}
                className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-gray-300 transition-all duration-300"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-500 text-sm">경기</p>
                    <p className="text-gray-800 font-medium">{prediction.raceName}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">베팅 유형</p>
                    <p className="text-gray-800 font-medium">{getBetTypeName(prediction.betType)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">선택한 말</p>
                    <p className="text-gray-800 font-medium">
                      {prediction.selectedHorses?.map(num => `${num}번`).join(', ') || '선택된 말 없음'}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">베팅 금액</p>
                    <p className="text-gray-800 font-medium">{prediction.amount.toLocaleString()}원</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">베팅 시간</p>
                    <p className="text-gray-800 font-medium">
                      {new Date(prediction.timestamp.toDate()).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">상태</p>
                    <p className={`font-medium ${getStatusColor(prediction.status)}`}>
                      {getStatusText(prediction.status)}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(prediction.id)}
                  className="gradient-button py-1 px-3 rounded-md text-sm font-medium transition-all duration-300 hover:shadow-lg hover:shadow-red-500/20 text-white mt-4"
                >
                  삭제
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PredictionHistory; 