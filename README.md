# Mecenate - лента публикаций (тестовое задание - 1 часть)

Мобильное приложение на **React Native** и **Expo**: экран ленты постов с пагинацией, обновлением pull-to-refresh и обработкой ошибок API

## Требования

- **Node.js** 20+
- **npm**
- На телефоне: приложение **Expo Go**

## Установка и запуск

```bash
cd rn-mecenate-app
npm install
```

При необходимости скопировать переменные окружения (см. ниже):

```bash
cp .env.example .env
```

Запуск dev-сервера:

```bash
npm run start
```

Дальше в терминале отсканировать QR-код для **Expo Go**.


## API

Документация: [OpenAPI / Swagger](https://k8s.mectest.ru/test-app/openapi.json)

## Дизайн

Макет: [Figma — Test Assignment](https://www.figma.com/design/bAxXrk7TaPN13TZ60yf7uD/Test-Assignment?node-id=0-1)

## Стек

TypeScript, Expo SDK 54, Expo Router, TanStack React Query, MobX
