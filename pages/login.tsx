import { NextPage } from 'next';
import Head from 'next/head';
import Auth from '../components/Auth';

const Login: NextPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <Head>
        <title>로그인 - 모의배팅 서비스</title>
        <meta name="description" content="모의배팅 서비스 로그인" />
      </Head>
      <Auth />
    </div>
  );
};

export default Login; 