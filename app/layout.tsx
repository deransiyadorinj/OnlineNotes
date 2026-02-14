import type { Metadata, Viewport } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import { Toaster } from 'sonner'

import './globals.css'

const _inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const _jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains-mono' })

export const metadata: Metadata = {
  title: 'Online Notes',
  description: 'A professional real-time cloud notes application',
}

export const viewport: Viewport = {
  themeColor: '#0f1118',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${_inter.variable} ${_jetbrainsMono.variable} font-sans antialiased`}>
        {children}
        <Toaster
          theme="dark"
          position="bottom-right"
          toastOptions={{
            style: {
              background: 'hsl(228 12% 10%)',
              border: '1px solid hsl(228 8% 16%)',
              color: 'hsl(210 20% 95%)',
            },
          }}
        />
      </body>
    </html>
  )
}
