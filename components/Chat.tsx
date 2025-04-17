import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ref, push, onValue, off, serverTimestamp, get, DatabaseReference, remove } from 'firebase/database';
import { database } from '../firebase';

interface Message {
  id: string;
  text: string;
  userId: string;
  userName: string;
  timestamp: number | null;
}

// 목업 메시지 추가
const mockMessages: Message[] = [
  {
    id: 'mock1',
    text: '안녕하세요! 경마 팬 여러분 😊',
    userId: 'admin',
    userName: '관리자',
    timestamp: Date.now() - 60000 // 1분 전
  },
  {
    id: 'mock2',
    text: '실시간 채팅에 오신 것을 환영합니다! 즐거운 대화 나누세요~',
    userId: 'admin',
    userName: '관리자',
    timestamp: Date.now() - 30000 // 30초 전
  },
  {
    id: 'mock3',
    text: '오늘 경마장 날씨가 좋네요!',
    userId: 'user1',
    userName: '경마왕',
    timestamp: Date.now() - 25000
  },
  {
    id: 'mock4',
    text: '네! 오늘 경기 기대되네요 😄',
    userId: 'user2',
    userName: '말타는여행자',
    timestamp: Date.now() - 20000
  },
  {
    id: 'mock5',
    text: '1경기 3번 말이 유력한데, 어떻게 생각하세요?',
    userId: 'user3',
    userName: '경마분석가',
    timestamp: Date.now() - 15000
  },
  {
    id: 'mock6',
    text: '저는 5번 말이 더 좋아 보이네요. 지난 경기에서 좋은 모습 보여줬어요!',
    userId: 'user4',
    userName: '말사랑',
    timestamp: Date.now() - 10000
  },
  {
    id: 'mock7',
    text: '모두 즐거운 경기 되세요! 🏇',
    userId: 'admin',
    userName: '관리자',
    timestamp: Date.now() - 5000
  }
];

export default function Chat() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [newMessage, setNewMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageRef = useRef<DatabaseReference | null>(null);

  useEffect(() => {
    if (!user) return;

    try {
      messageRef.current = ref(database, 'messages');
      console.log('Database reference created:', messageRef.current.toString());
      
      // Initial fetch
      const fetchInitialMessages = async () => {
        try {
          const snapshot = await get(messageRef.current!);
          const data = snapshot.val();
          if (data) {
            const messageList = Object.entries(data).map(([id, message]: [string, any]) => ({
              id,
              text: message.text || '',
              userId: message.userId || '',
              userName: message.userName || '익명',
              timestamp: message.timestamp || null
            }));
            setMessages([...mockMessages, ...messageList].sort((a, b) => {
              if (a.timestamp === null) return 1;
              if (b.timestamp === null) return -1;
              return a.timestamp - b.timestamp;
            }));
            console.log('Initial messages loaded');
          }
        } catch (error) {
          console.error('Error fetching initial messages:', error);
          setError('메시지를 불러오는데 실패했습니다.');
        }
      };

      fetchInitialMessages();

      // Real-time listener
      const handleNewMessage = (snapshot: any) => {
        try {
          const data = snapshot.val();
          if (data) {
            const messageList = Object.entries(data).map(([id, message]: [string, any]) => ({
              id,
              text: message.text || '',
              userId: message.userId || '',
              userName: message.userName || '익명',
              timestamp: message.timestamp || null
            }));
            setMessages([...mockMessages, ...messageList].sort((a, b) => {
              if (a.timestamp === null) return 1;
              if (b.timestamp === null) return -1;
              return a.timestamp - b.timestamp;
            }));
            console.log('Messages updated');
          }
        } catch (error) {
          console.error('Error processing new messages:', error);
        }
      };

      onValue(messageRef.current, handleNewMessage, (error) => {
        console.error('Error in message listener:', error);
        setError('실시간 메시지 수신에 실패했습니다.');
      });

      return () => {
        if (messageRef.current) {
          console.log('Cleaning up message listener');
          off(messageRef.current);
        }
      };
    } catch (error) {
      console.error('Error setting up chat:', error);
      setError('채팅 초기화에 실패했습니다.');
    }
  }, [user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user || !messageRef.current) {
      console.log('Message send validation failed:', {
        hasMessage: !!newMessage.trim(),
        hasUser: !!user,
        hasRef: !!messageRef.current
      });
      return;
    }

    let tempMessage: Message | null = null;
    try {
      console.log('Attempting to send message:', {
        text: newMessage,
        userId: user.uid,
        userName: user.displayName
      });

      // 임시 메시지 생성
      tempMessage = {
        id: 'temp-' + Date.now(),
        text: newMessage,
        userId: user.uid,
        userName: user.displayName || '익명',
        timestamp: Date.now()
      };

      // 즉시 상태 업데이트
      setMessages(prev => [...prev, tempMessage]);
      setNewMessage('');
      setError(null);

      // Firebase에 메시지 저장
      const newMessageRef = await push(messageRef.current, {
        text: newMessage,
        userId: user.uid,
        userName: user.displayName || '익명',
        timestamp: serverTimestamp()
      });

      console.log('Message sent successfully:', newMessageRef.key);
    } catch (error) {
      console.error('Error sending message:', error);
      setError('메시지 전송에 실패했습니다. 잠시 후 다시 시도해주세요.');
      // 실패 시 임시 메시지 제거
      if (tempMessage) {
        setMessages(prev => prev.filter(msg => msg.id !== tempMessage!.id));
      }
    }
  };

  const deleteMessage = async (messageId: string) => {
    if (!messageRef.current || !user) return;

    try {
      // Firebase에서 메시지 삭제
      const messageToDeleteRef = ref(database, `messages/${messageId}`);
      await remove(messageToDeleteRef);
      
      // 상태에서도 메시지 제거
      setMessages(prev => prev.filter(msg => msg.id !== messageId));
    } catch (error) {
      console.error('Error deleting message:', error);
      setError('메시지 삭제에 실패했습니다.');
    }
  };

  const formatTimestamp = (timestamp: number | null) => {
    if (timestamp === null) return '';
    return new Date(timestamp).toLocaleTimeString();
  };

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-lg shadow-lg">
      <div className="p-4 border-b">
        <h2 className="text-xl font-bold text-primary">실시간 채팅</h2>
        {error && (
          <p className="text-red-500 text-sm mt-1">{error}</p>
        )}
      </div>
      
      {!user ? (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-500">채팅을 이용하려면 로그인이 필요합니다.</p>
        </div>
      ) : (
        <>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 py-4">
                아직 메시지가 없습니다. 첫 메시지를 보내보세요!
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.userId === user?.uid ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[70%] rounded-lg p-3 ${
                      message.userId === user?.uid
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="text-sm font-medium mb-1">
                        {message.userName || '익명'}
                      </div>
                      {message.userId === user?.uid && !message.id.startsWith('mock') && (
                        <button
                          onClick={() => deleteMessage(message.id)}
                          className="text-xs text-red-300 hover:text-red-100 ml-2"
                        >
                          삭제
                        </button>
                      )}
                    </div>
                    <div>{message.text}</div>
                    <div className="text-xs mt-1 opacity-70">
                      {formatTimestamp(message.timestamp)}
                    </div>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={sendMessage} className="p-4 border-t">
            <div className="flex space-x-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="메시지를 입력하세요..."
                className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
              >
                전송
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
} 