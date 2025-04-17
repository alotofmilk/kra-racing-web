import Chat from '../components/Chat';

export default function ChatPage() {
  return (
    <div className="min-h-screen bg-gray-100 pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-center mb-16 text-black" style={{ fontFamily: 'SDKukdetopokki, serif' }}>
             
        </h1>
        <Chat />
      </div>
    </div>
  );
} 