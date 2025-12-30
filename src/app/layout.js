import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'
import ClientLayout from './ClientLayout'

export const metadata = {
  title: 'POS Pro - Point of Sale System',
  description: 'Professional Point of Sale System',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <ClientLayout>{children}</ClientLayout>
        </AuthProvider>
      </body>
    </html>
  )
}
