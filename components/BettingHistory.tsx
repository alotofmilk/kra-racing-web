import { useEffect, useState } from 'react';
import { collection, query, where, orderBy, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';

interface Bet {
  id: string;
  userId: string;
  horseNumber: number;
  horseName: string;
  amount: number;
  odds: number;
  timestamp: Date;
  status: 'pending' | 'won' | 'lost';
}

const BettingHistory = () => {
  const { user } = useAuth();
  const [bets, setBets] = useState<Bet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const q = query(
        collection(db, 'bets'),
        where('userId', '==', user.uid),
        orderBy('timestamp', 'desc')
      );

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const betsData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            timestamp: doc.data().timestamp?.toDate() || new Date()
          })) as Bet[];
          setBets(betsData);
          setLoading(false);
        },
        (error) => {
          console.error('Error fetching bets:', error);
          setError('배팅 내역을 불러오는 중 오류가 발생했습니다.');
          setLoading(false);
        }
      );

      return () => unsubscribe();
    } catch (error) {
      console.error('Error setting up listener:', error);
      setError('배팅 내역을 불러오는 중 오류가 발생했습니다.');
      setLoading(false);
    }
  }, [user]);

  const handleDelete = async (betId: string) => {
    if (!user) return;
    
    try {
      setDeletingId(betId);
      await deleteDoc(doc(db, 'bets', betId));
    } catch (error) {
      console.error('Error deleting bet:', error);
      setError('배팅 내역 삭제 중 오류가 발생했습니다.');
    } finally {
      setDeletingId(null);
    }
  };

  if (!user) return null;

  // 목업 데이터
  const mockBets: Bet[] = [
    {
      id: 'mock-1',
      userId: user.uid,
      horseNumber: 3,
      horseName: '쾌속',
      amount: 10000,
      odds: 2.5,
      timestamp: new Date(Date.now() - 86400000), // 1일 전
      status: 'won'
    },
    {
      id: 'mock-2',
      userId: user.uid,
      horseNumber: 7,
      horseName: '번개',
      amount: 5000,
      odds: 3.0,
      timestamp: new Date(Date.now() - 172800000), // 2일 전
      status: 'lost'
    }
  ];

  const displayBets = bets.length > 0 ? bets : mockBets;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">배팅 내역</h2>
      {loading ? (
        <p className="text-gray-600">로딩 중...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : displayBets.length === 0 ? (
        <p className="text-gray-600">아직 배팅 내역이 없습니다.</p>
      ) : (
        <div className="space-y-4">
          {displayBets.map((bet) => (
            <div key={bet.id} className="border-b pb-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">
                    {bet.horseNumber}번 {bet.horseName}
                  </p>
                  <p className="text-sm text-gray-600">
                    배당률: {bet.odds} | 금액: {(bet.amount || 0).toLocaleString()}원
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">
                    {bet.timestamp.toLocaleString()}
                  </p>
                  <div className="flex items-center justify-end space-x-2 mt-1">
                    <span className={`px-2 py-1 rounded text-sm ${
                      bet.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      bet.status === 'won' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {bet.status === 'pending' ? '진행중' :
                       bet.status === 'won' ? '승리' : '패배'}
                    </span>
                    {!bet.id.startsWith('mock-') && (
                      <button
                        onClick={() => handleDelete(bet.id)}
                        disabled={deletingId === bet.id}
                        className="text-red-500 hover:text-red-700 disabled:opacity-50"
                      >
                        {deletingId === bet.id ? '삭제 중...' : '삭제'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BettingHistory; 