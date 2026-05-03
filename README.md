# Mecenate - лента публикаций + детальный пост (тестовое задание 1 и 2)

Экран ленты и детального поста для **Mecenate** - сервиса поддержки авторов: пользователь открывает пост, читает полный текст, лайкает и оставляет комментарии с real-time обновлениями.

Платформы: **iOS и Android** через **React Native** и **Expo**, запуск в **Expo Go**.

## Реализовано по заданию

- Лента: список постов (аватар, имя, превью текста, обложка, счётчики лайков и комментариев)
- Лента: таб-фильтр **Все / Бесплатные / Платные**
- Лента: **курсорная пагинация** и **pull-to-refresh**
- Если API недоступен: страницы ошибки и кнопка повтора
- Детальный пост: полный текст, обложка, имя автора
- Лайк: **анимация счётчика + haptic**
- Комментарии: lazy load, сортировка, поле ввода + отправка
- Real-time: обновления лайков поста и комментариев через **WebSocket**

## Стек

- **TypeScript**
- **React Native + Expo** (iOS и Android)
- **MobX** (сессия / UUID) и **TanStack React Query** (лента + детали)
- **Reanimated 2** + **expo-haptics** (анимации лайков)
- Стили через **дизайн-токены** - `src/theme`

## Требования для запуска

- **Node.js** 20+
- **npm**
- На телефоне: Expo Go

## Установка и запуск

```bash
cd rn-mecenate-app
npm install
npm run start
```
В терминале Expo отсканировать QR-код в **Expo Go**

Переменные окружения (опционально): скопировать `.env.example` в `.env`
Нужна **`EXPO_PUBLIC_API_BASE_URL`** - базовый URL API, 
в коде по дефолту используется `https://k8s.mectest.ru/test-app`.

## Тесты

```bash
npm run test
```

## API (Swagger)

Спецификация: [openapi.json](https://k8s.mectest.ru/test-app/openapi.json)

WebSocket: [документация](https://k8s.mectest.ru/test-app/docs)

## Дизайн (Figma)

Макет 1: [Test Assignment 1](https://www.figma.com/design/bAxXrk7TaPN13TZ60yf7uD/Test-Assignment?node-id=0-1&p=f&t=qnWbxTDbClFsVhxB-0)

Макет 2: [Test Assignment 2](https://www.figma.com/design/bAxXrk7TaPN13TZ60yf7uD/Test-Assignment?node-id=1-3265&p=f&t=JuZjzgkzXf1kjhvS-0)
