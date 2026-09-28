'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

export type Locale = 'en' | 'ru'

type TranslationKey = keyof typeof translations.en

const translations = {
  en: {
    'brand.subtitle': 'Operations console',
    'nav.dashboard': 'Dashboard',
    'nav.orders': 'Orders',
    'nav.products': 'Products',
    'top.sessions': 'active tabs',
    'top.connected': 'Realtime online',
    'top.disconnected': 'Realtime reconnecting',
    'top.language': 'Language',
    'dashboard.title': 'Operations dashboard',
    'dashboard.subtitle': 'Distributed Orders & Products platform',
    'dashboard.api': 'API status',
    'dashboard.architecture': 'Architecture',
    'dashboard.architectureValue': '3 micro frontends · 2 microservices · GraphQL · WebSocket',
    'dashboard.chart': 'Order value, USD',
    'dashboard.map': 'Fulfillment hubs',
    'orders.title': 'Orders',
    'orders.subtitle': 'Incoming inventory batches',
    'orders.add': 'New order',
    'orders.products': 'products',
    'orders.created': 'Created',
    'orders.total': 'Total',
    'orders.details': 'Order details',
    'orders.empty': 'No products in this order',
    'orders.delete': 'Delete order',
    'orders.confirmTitle': 'Delete this order?',
    'orders.confirmBody': 'The order and all related products will be removed.',
    'orders.cancel': 'Cancel',
    'orders.confirm': 'Delete',
    'orders.formTitle': 'Create order',
    'orders.name': 'Title',
    'orders.description': 'Description',
    'orders.save': 'Create',
    'orders.loading': 'Loading orders',
    'orders.error': 'Unable to load orders',
    'products.title': 'Products',
    'products.subtitle': 'Inventory across all orders',
    'products.type': 'Type',
    'products.allTypes': 'All types',
    'products.guarantee': 'Guarantee',
    'products.price': 'Price',
    'products.order': 'Order',
    'products.serial': 'Serial',
    'products.loading': 'Loading products',
    'products.error': 'Unable to load products',
    'products.empty': 'No products match this filter',
    'status.new': 'New',
    'status.used': 'Used'
  },
  ru: {
    'brand.subtitle': 'Операционная консоль',
    'nav.dashboard': 'Обзор',
    'nav.orders': 'Приходы',
    'nav.products': 'Продукты',
    'top.sessions': 'активных вкладок',
    'top.connected': 'Realtime подключен',
    'top.disconnected': 'Realtime переподключается',
    'top.language': 'Язык',
    'dashboard.title': 'Операционный обзор',
    'dashboard.subtitle': 'Распределённая платформа Orders & Products',
    'dashboard.api': 'Статус API',
    'dashboard.architecture': 'Архитектура',
    'dashboard.architectureValue': '3 микрофронтенда · 2 микросервиса · GraphQL · WebSocket',
    'dashboard.chart': 'Стоимость приходов, USD',
    'dashboard.map': 'Центры обработки',
    'orders.title': 'Приходы',
    'orders.subtitle': 'Партии входящего оборудования',
    'orders.add': 'Новый приход',
    'orders.products': 'продуктов',
    'orders.created': 'Создан',
    'orders.total': 'Сумма',
    'orders.details': 'Детали прихода',
    'orders.empty': 'В этом приходе нет продуктов',
    'orders.delete': 'Удалить приход',
    'orders.confirmTitle': 'Удалить этот приход?',
    'orders.confirmBody': 'Приход и все связанные продукты будут удалены.',
    'orders.cancel': 'Отмена',
    'orders.confirm': 'Удалить',
    'orders.formTitle': 'Создать приход',
    'orders.name': 'Название',
    'orders.description': 'Описание',
    'orders.save': 'Создать',
    'orders.loading': 'Загрузка приходов',
    'orders.error': 'Не удалось загрузить приходы',
    'products.title': 'Продукты',
    'products.subtitle': 'Оборудование из всех приходов',
    'products.type': 'Тип',
    'products.allTypes': 'Все типы',
    'products.guarantee': 'Гарантия',
    'products.price': 'Цена',
    'products.order': 'Приход',
    'products.serial': 'Серийный номер',
    'products.loading': 'Загрузка продуктов',
    'products.error': 'Не удалось загрузить продукты',
    'products.empty': 'Нет продуктов для выбранного фильтра',
    'status.new': 'Новый',
    'status.used': 'Б/у'
  }
} as const

interface I18nContextValue {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: TranslationKey) => string
}

const I18nContext = createContext<I18nContextValue | null>(null)
const storageKey = 'orders-hub.locale'

export const I18nProvider = ({ children }: { children: ReactNode }) => {
  const [locale, updateLocale] = useState<Locale>('en')

  useEffect(() => {
    const saved = window.localStorage.getItem(storageKey)
    if (saved === 'en' || saved === 'ru') {
      updateLocale(saved)
    }
  }, [])

  const setLocale = useCallback((nextLocale: Locale) => {
    updateLocale(nextLocale)
    window.localStorage.setItem(storageKey, nextLocale)
  }, [])

  const t = useCallback((key: TranslationKey) => translations[locale][key], [locale])
  const value = useMemo(() => ({ locale, setLocale, t }), [locale, setLocale, t])

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export const useI18n = () => {
  const value = useContext(I18nContext)
  if (!value) {
    throw new Error('I18nProvider is required')
  }
  return value
}
