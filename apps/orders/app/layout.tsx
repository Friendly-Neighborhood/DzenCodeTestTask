import type { Metadata } from 'next'
import 'bootstrap/dist/css/bootstrap.min.css'
import '@orders-hub/ui/styles.css'
import './globals.css'
import { AppFrame, PwaRegistrar } from '@orders-hub/ui'
import { I18nProvider } from '@orders-hub/shared'
import { ReduxProvider } from '../components/ReduxProvider'

export const metadata: Metadata = {
  title: 'Orders · Orders Hub',
  description: 'Orders micro frontend'
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <I18nProvider>
          <ReduxProvider>
            <PwaRegistrar basePath="/orders" />
            <AppFrame>{children}</AppFrame>
          </ReduxProvider>
        </I18nProvider>
      </body>
    </html>
  )
}
