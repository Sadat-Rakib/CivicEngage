import './globals.css'
import { Inter } from 'next/font/google'
import Providers from './providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'CivicEngage - Empowering Communities, One Tap at a Time',
  description: 'Gamified civic engagement platform for Gen Z and young adults',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  )
}