# Learning Platform - Платформа для онлайн-обучения

Учебное приложение для управления курсами и обучения, реализованное на Angular с поддержкой SSR (Server-Side Rendering).

## 🚀 Технологический стек

- **Frontend**: Angular 17+, TypeScript
- **State Management**: 
  - `main` - Angular Services + Signals
  - `NgRx` - NgRx Store + Effects
  - `NGXS` - NGXS State Management
- **UI Framework**: Angular Material
- **Internationalization**: Transloco
- **SSR**: Angular SSR (Server-Side Rendering)
- **Routing**: Angular Router с гибридным рендерингом

## 🌟 Функциональность

### 🔐 Аутентификация и пользователи
- Регистрация и вход пользователей
- Ролевая модель (Студент/Преподаватель)
- Управление профилем

### 📚 Управление курсами
- Просмотр каталога курсов
- Фильтрация по категориям и сложности
- Поиск по названию и описанию
- Детальные страницы курсов

### 🎓 Система обучения
- Навигация по урокам
- Видео-уроки (заглушки)
- Навигация вперед/назад

 ## 🛠️ Установка и запуск

 Клонирование репозитория
```bash
git clone <https://github.com/tyskanhik/learning-platform>
cd learning-platform
```



Выбор ветки
```bash
git checkout main        # Сервисы + Signals
git checkout NgRx        # NgRx implementation  
git checkout NGXS        # NGXS implementation
```

Установка зависимостей
```bash
npm install
```

Запуск в development режиме
```bash
ng serve
```

Запуск в ssr режиме production режиме
```bash
ng build
npm run serve:ssr:learning-platform
```