import type { Metadata } from 'next'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'leaflet/dist/leaflet.css'
import '@orders-hub/ui/styles.css'
import './globals.css'
import { AppFrame, PwaRegistrar } from '@orders-hub/ui'
import { I18nProvider } from '@orders-hub/shared'

export const metadata: Metadata = {
  title: 'Orders Hub',
  description: 'Distributed Orders & Products operations console'
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <I18nProvider>
          <PwaRegistrar />
          <AppFrame>{children}</AppFrame>
        </I18nProvider>
      </body>
    </html>
  )
}
