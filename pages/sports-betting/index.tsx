import { NextPage } from 'next';
import Head from 'next/head';

const SportsBetting: NextPage = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Head>
        <title>승부예측 - 모의배팅 서비스</title>
        <meta name="description" content="스포츠 승부예측" />
      </Head>

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">승부예측</h1>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="text-gray-600">준비 중입니다...</p>
        </div>
      </main>
    </div>
  );
};

export default SportsBetting; 