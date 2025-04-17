import type { AppProps } from 'next/app';
import { Inter } from 'next/font/google';
import { Playfair_Display, Montserrat, Cinzel, Cormorant_Garamond } from 'next/font/google';
import '../styles/globals.css';
import { AuthProvider } from '../contexts/AuthContext';
import NavBar from '../components/NavBar';

const inter = Inter({ subsets: ['latin'] });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' });
const montserrat = Montserrat({ subsets: ['latin'], variable: '--font-montserrat' });
const cinzel = Cinzel({ subsets: ['latin'], variable: '--font-cinzel' });
const cormorant = Cormorant_Garamond({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-cormorant'
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <main className={`${inter.className} font-playfair font-montserrat font-cinzel font-cormorant`}>
        <NavBar />
        <Component {...pageProps} />
      </main>
    </AuthProvider>
  );
}

export default MyApp; 