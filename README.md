# Mecenate - лента публикаций (тестовое задание 1 часть)

Экран ленты для **Mecenate** - сервиса поддержки авторов: пользователь видит посты авторов, на которых подписан. 
Платформы: **iOS и Android** через **React Native** и **Expo**, запуск в **Expo Go**.

## Реализовано по заданию

- Список постов: аватар, имя, превью текста, обложка, счётчики лайков и комментариев
- **Курсорная пагинация** - подгрузка при скролле вниз
- **Pull-to-refresh**
- Если API недоступен: страницы ошибки и кнопка повтора

## Стек

- **TypeScript**
- **React Native + Expo** (iOS и Android)
- **MobX** (сессия / UUID) и **TanStack React Query** (лента)
- Стили через **дизайн-токены** - `src/theme`

## Требования для запуска

- **Node.js** 20+
- **npm**
- На телефоне: [**Expo Go**](https://expo.dev/go)

## Установка и запуск

```bash
cd rn-mecenate-app
npm install
npm run start
```
В терминале Expo отсканировать QR-код в **Expo Go**

Переменные окружения (опционально): скопировать `.env.example` в `.env`
Нужна **`EXPO_PUBLIC_API_BASE_URL`** - базовый URL API, в коде по дефолту используется `https://k8s.mectest.ru/test-app`.


## API (Swagger)

Спецификация: [openapi.json](https://k8s.mectest.ru/test-app/openapi.json). 

## Дизайн (Figma)

Макет: [Test Assignment](https://www.figma.com/design/bAxXrk7TaPN13TZ60yf7uD/Test-Assignment?node-id=0-1&p=f&t=qnWbxTDbClFsVhxB-0)
