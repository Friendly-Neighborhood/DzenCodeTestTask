# Railway deployment

Этот вариант не требует держать компьютер включённым. GitHub хранит код, Railway собирает и постоянно запускает приложение в облаке.

## Что получится

Публичный адрес нужен только для `shell`, `api` и `realtime`. `orders-web`, `products-web`, MySQL и Redis работают внутри приватной сети Railway.

## 1. GitHub

Создайте пустой GitHub repository и отправьте туда этот проект.

```bash
git remote add origin https://github.com/USERNAME/orders-products-middle-plus.git
git push -u origin main
git push origin --all
git push origin --tags
```

## 2. Railway project

Откройте Railway, создайте `Empty Project` и подключите GitHub account.

Добавьте две базы через `New -> Database`:

- MySQL
- Redis

Дождитесь статуса `Online`.

## 3. API

Добавьте `New -> GitHub Repo`, выберите тот же repository и назовите service `api`.

Откройте `Variables -> Raw Editor` и вставьте содержимое `deploy/railway/api.env`.

Замените `replace-with-a-long-random-secret` на длинную случайную строку.

Нажмите `Deploy`.

После успешного запуска откройте `Settings -> Networking -> Public Networking -> Generate Domain`.

## 4. Realtime

Добавьте тот же GitHub repository ещё раз и назовите service `realtime`.

В `Variables -> Raw Editor` вставьте `deploy/railway/realtime.env`.

Нажмите `Deploy`, затем создайте public domain через `Settings -> Networking -> Public Networking -> Generate Domain`.

## 5. Orders micro frontend

Добавьте тот же repository и назовите service `orders-web`.

Вставьте `deploy/railway/orders-web.env` в `Variables -> Raw Editor` и нажмите `Deploy`.

Public domain для этого service не нужен.

## 6. Products micro frontend

Добавьте тот же repository и назовите service `products-web`.

Вставьте `deploy/railway/products-web.env` и нажмите `Deploy`.

Public domain для этого service не нужен.

## 7. Shell

Добавьте repository ещё раз и назовите service `shell`.

Вставьте `deploy/railway/shell.env` и нажмите `Deploy`.

После успешного запуска создайте public domain через `Settings -> Networking -> Public Networking -> Generate Domain`.

Полученный адрес вида `https://...up.railway.app` является ссылкой на готовое приложение. Компьютер после этого можно выключить.

## 8. Проверка

Откройте адрес `shell` и проверьте:

- Dashboard
- Orders
- Products
- создание и удаление прихода
- фильтрацию продуктов
- переключение языка
- счётчик активных вкладок в двух вкладках браузера
- обновление страниц `/orders` и `/products`

## 9. Дальнейшие обновления

После связи Railway с GitHub новые commit в `main` автоматически запускают новую сборку и deployment. Локальный компьютер нужен только для изменения кода и отправки commit в GitHub, а не для работы сайта.
