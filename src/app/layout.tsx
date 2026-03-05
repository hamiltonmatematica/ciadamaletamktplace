import type { Metadata } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'
import { QuoteCartProvider } from '@/contexts/quote-cart-context'
import QuoteCartDrawer from '@/components/ui/quote-cart-drawer'
import BottomNav from '@/components/layout/bottom-nav'

const jakarta = Plus_Jakarta_Sans({
    subsets: ['latin'],
    weight: ['300', '400', '500', '600', '700', '800'],
    variable: '--font-jakarta'
})

export const metadata: Metadata = {
    title: 'Cia da Maleta - Festas Mágicas',
    description: 'Descubra nossa coleção exclusiva de maletas de luxo e kits de festa personalizados.',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="pt-br" className="light">
            <head>
                <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=block" />
            </head>
            <body className={`${jakarta.variable} font-display bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 antialiased pb-16 md:pb-0`}>
                <QuoteCartProvider>
                    {children}
                    <QuoteCartDrawer />
                    <BottomNav />
                </QuoteCartProvider>
            </body>
        </html>
    )
}
