import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const inter = Inter({ 
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-inter"
});

const jetbrainsMono = JetBrains_Mono({ 
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains"
});

export const metadata: Metadata = {
  title: 'NODE3 | Estudio de Ingeniería de Software',
  description: 'Soluciones reales para problemas reales.',

  icons: {
    icon: '/logos/node3-fondo.jpeg',
    apple: '/logos/node3-fondo.jpeg',
  },

  openGraph: {
    title: 'NODE3 | Estudio de Ingeniería de Software',
    description: 'Soluciones reales para problemas reales.',
    url: 'https://landing-page-node3.vercel.app',
    siteName: 'NODE3',
    images: [
      {
        url: 'https://landing-page-node3.vercel.app/logos/node3-fondo.jpeg',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'es_AR',
    type: 'website',
  },

  twitter: {
    card: 'summary_large_image',
    title: 'NODE3 | Estudio de Ingeniería de Software',
    description: 'Soluciones reales para problemas reales.',
    images: ['https://landing-page-node3.vercel.app/logos/node3-fondo.jpeg'],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className="dark">
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
