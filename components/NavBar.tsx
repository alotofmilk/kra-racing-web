import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';
import Image from 'next/image';

export default function NavBar() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <nav className="bg-white shadow-md mt-3 relative">
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/50 to-transparent blur-sm"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <div className="relative w-32 h-12">
                <Image
                  src="/images/kraLogo.jpeg"
                  alt="KRA Logo"
                  width={80}
                  height={80}
                  className="rounded-full"
                  sizes="(max-width: 768px) 80px, 80px"
                />
              </div>
            </Link>
            <div className="hidden md:ml-6 md:flex md:space-x-8">
              <Link
                href="/"
                className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                  router.pathname === '/'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                HOME
              </Link>
              <Link
                href="/horse-info"
                className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                  router.pathname === '/horse-info'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                경주마 정보
              </Link>
              <Link
                href="/transportation"
                className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                  router.pathname === '/transportation'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                교통편 안내
              </Link>
              <Link
                href="/ranking"
                className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                  router.pathname === '/ranking'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                랭킹
              </Link>
              <Link
                href="/chat"
                className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                  router.pathname === '/chat'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                채팅
              </Link>
            </div>
          </div>

          <div className="flex items-center">
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-700">
                  {user.email.split('@')[0]}
                </span>
                <button
                  onClick={handleLogout}
                  className="px-3 py-1 rounded-md text-sm font-medium text-white transition-colors duration-300"
                  style={{
                    background: 'linear-gradient(to right, #8B008B, #4B0082)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}
                >
                  로그아웃
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="px-3 py-1 rounded-md text-sm font-medium text-white transition-colors duration-300"
                style={{
                  background: 'linear-gradient(to right, #8B008B, #4B0082)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}
              >
                로그인
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
} 