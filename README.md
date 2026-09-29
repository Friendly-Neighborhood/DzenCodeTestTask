# Orders & Products · Middle+

Монорепозиторий реализует тестовое задание Orders & Products на уровне Middle+.

## Архитектура

```text
Browser
  |
  v
Next.js Shell :3000
  |-- /orders   -> Orders Micro Frontend :3001
  |-- /products -> Products Micro Frontend :3002
  |
  |-- GraphQL/REST -> API Microservice :4000 -> MySQL
  |-- WebSocket    -> Realtime Microservice :4001 -> Redis
                                      ^
                                      |
                                 domain.events
```

Shell, Orders и Products являются отдельными Next.js zones и могут собираться и масштабироваться независимо. Shell проксирует маршруты `/orders` и `/products` на соответствующие zones. Общий UI и инфраструктурный клиент вынесены в workspace packages.

API остаётся stateless, хранит бизнес-данные в MySQL, выдаёт JWT для браузерной сессии, предоставляет REST endpoints и GraphQL. Изменения агрегатов публикуются в Redis channel `domain.events`. Realtime service подписывается на канал и рассылает события подключённым клиентам через Socket.IO. Redis adapter позволяет запускать несколько realtime instances за load balancer.

Счётчик активных вкладок хранится в Redis sorted set. Каждая вкладка создаёт один shared WebSocket connection. Heartbeat обновляет lease, а cleanup удаляет stale connections после аварийного завершения instance.

Расчёт сумм приходов выполняется в Web Worker. Worker загружает WebAssembly module `add.wasm` и складывает суммы в integer cents, после чего возвращает результат UI. Исходник модуля находится в `wasm/add.wat`.

## Стек

React, Next.js, TypeScript, Redux Toolkit, Bootstrap, BEM, GraphQL, REST Fetch, JWT, React Hook Form, Zod, Socket.IO, Redis, Prisma, MySQL, PWA Service Worker, Web Workers, WebAssembly, Recharts, React Leaflet, Vitest, Supertest, Playwright, Docker Compose.

## Функциональность

Orders отображает название прихода, число продуктов, дату в двух форматах, суммы USD и UAH, открытие соседней панели, закрытие панели, удаление через confirmation dialog и создание прихода через валидируемую форму.

Products отображает все продукты, фильтр по типу, название, тип, serial number, статус, гарантию в разных форматах, цены в валютах и название связанного прихода.

TopMenu показывает дату и время в реальном времени, статус WebSocket и количество активных вкладок. Navigation Menu содержит переходы Dashboard, Orders и Products. Интерфейс имеет route/component transitions и адаптивную верстку.

Dashboard содержит lazy-loaded chart и map. Язык EN/RU хранится в Local Storage. JWT хранится в Session Storage. PWA service workers подключены для shell и feature zones.

## Публикация в интернет через Railway

Для cloud deployment без собственного VPS подготовлена конфигурация в `deploy/railway`. Код хранится в GitHub, а frontend, API, WebSocket, MySQL и Redis постоянно работают в Railway. Компьютер разработчика после deployment не нужен.

Пошаговая инструкция находится в `deploy/railway/README.md`.

## Быстрый запуск через Docker

```bash
docker compose up --build
```

После запуска:

```text
http://localhost:3000
http://localhost:4000/health
```

MySQL опубликован на `localhost:3307`, Redis на `localhost:6379`, realtime service на `localhost:4001`.

Остановка с удалением volume:

```bash
docker compose down -v
```

## Локальная разработка

Требуются Node.js 22+, npm, Docker.

```bash
npm install
cp .env.example .env
docker compose up -d mysql redis
set -a
source .env
set +a
npm run db:push
npm run db:seed
npm run dev
```

Shell стартует на `3000`, Orders zone на `3001`, Products zone на `3002`, API на `4000`, realtime service на `4001`.

## Тесты

Unit и HTTP integration tests:

```bash
npm test
```

Functional E2E tests требуют запущенные MySQL и Redis и подготовленную БД:

```bash
npm run test:e2e
```

Для проверки уже запущенного Docker stack:

```bash
E2E_EXTERNAL=1 npm run test:e2e
```

## База данных

Prisma schema находится в `services/api/prisma/schema.prisma`.

SQL schema находится в `database/schema.sql` и открывается в MySQL Workbench как SQL script. В схеме есть `orders`, `products`, `prices`, индексы по датам, типам и внешним ключам, а также cascade delete для связанных сущностей.

## Масштабирование

Для нагрузки порядка 1 000 000 сообщений и 100 000 пользователей web zones масштабируются независимо. API replicas остаются stateless. Realtime replicas используют Socket.IO Redis adapter для межинстансной доставки и Redis sorted set для распределённого presence. MySQL indexes покрывают текущие lookup paths. Для production Redis можно перевести на managed cluster, MySQL на managed primary/replicas, а `domain.events` заменить совместимым durable broker без изменения контрактов фронтенда.

Micro Frontend boundaries позволяют выпускать Orders и Products независимо. Shared packages содержат только стабильные UI и transport contracts, а Redux state остаётся локальным каждой feature zone, что уменьшает runtime coupling.

## Структура

```text
apps/shell
apps/orders
apps/products
packages/shared
packages/ui
services/api
services/realtime
database
wasm
tests
```

## Git

Репозиторий подготовлен как Git project с отдельными feature branches в истории. После распаковки его можно отправить в любой remote:

```bash
git remote add origin <repository-url>
git push -u origin main --all
git push origin --tags
```
