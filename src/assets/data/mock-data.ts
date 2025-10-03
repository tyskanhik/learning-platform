import { CourseModel } from '../../app/core/models/course.model';

export const MOCK_COURSES: CourseModel[] = [
  new CourseModel(
    1,
    { 
      en: 'Introduction to Angular', 
      ru: 'Введение в Angular' 
    },
    { 
      en: 'Frontend Development', 
      ru: 'Frontend разработка' 
    },
    4.5,
    'James Hetfield',
    { 
      en: 'Complete course on Angular for beginners. Learn the basics of the framework, components, services and routing.', 
      ru: 'Полный курс по Angular для начинающих. Изучите основы фреймворка, компоненты, сервисы и маршрутизацию.' 
    },
    [
      { 
        en: 'Master Angular basics', 
        ru: 'Освоить основы Angular' 
      },
      { 
        en: 'Learn to create components', 
        ru: 'Научиться создавать компоненты' 
      },
      { 
        en: 'Understand services and DI', 
        ru: 'Понимать работу сервисов и DI' 
      },
      { 
        en: 'Implement routing', 
        ru: 'Реализовать маршрутизацию' 
      }
    ],
    [
      { 
        en: 'Module 1: Introduction to Angular', 
        ru: 'Модуль 1: Введение в Angular' 
      },
      { 
        en: 'Module 2: Components and Templates', 
        ru: 'Модуль 2: Компоненты и шаблоны' 
      },
      { 
        en: 'Module 3: Services and Dependency Injection', 
        ru: 'Модуль 3: Сервисы и Dependency Injection' 
      },
      { 
        en: 'Module 4: Routing and Navigation', 
        ru: 'Модуль 4: Маршрутизация и навигация' 
      },
      { 
        en: 'Module 5: Forms and Validation', 
        ru: 'Модуль 5: Формы и валидация' 
      }
    ],
    'beginner',
    [
      {
        id: 1,
        title: { 
          en: 'What is Angular?', 
          ru: 'Что такое Angular?' 
        },
        description: { 
          en: 'Introduction to the framework, environment setup, creating your first application.', 
          ru: 'Введение в фреймворк, установка окружения, создание первого приложения.' 
        },
        videoUrl: 'https://example.com/video/angular-intro.mp4',
        duration: '25:15',
        order: 1
      },
      {
        id: 2,
        title: { 
          en: 'Components and Templates', 
          ru: 'Компоненты и шаблоны' 
        },
        description: { 
          en: 'Creating components, working with templates, interpolation and directives.', 
          ru: 'Создание компонентов, работа с шаблонами, интерполяция и директивы.' 
        },
        videoUrl: 'https://example.com/video/angular-components.mp4',
        duration: '32:40',
        order: 2
      },
      {
        id: 3,
        title: { 
          en: 'Services and Dependency Injection', 
          ru: 'Сервисы и Dependency Injection' 
        },
        description: { 
          en: 'Creating services, dependency injection mechanism, HttpClient.', 
          ru: 'Создание сервисов, механизм внедрения зависимостей, HttpClient.' 
        },
        videoUrl: 'https://example.com/video/angular-services.mp4',
        duration: '28:20',
        order: 3
      },
      {
        id: 4,
        title: { 
          en: 'Routing', 
          ru: 'Маршрутизация' 
        },
        description: { 
          en: 'Configuring routes, navigation, protected routes.', 
          ru: 'Настройка маршрутов, навигация, защищенные маршруты.' 
        },
        videoUrl: 'https://example.com/video/angular-routing.mp4',
        duration: '35:10',
        order: 4
      },
      {
        id: 5,
        title: { 
          en: 'Reactive Forms', 
          ru: 'Реактивные формы' 
        },
        description: { 
          en: 'Creating forms, validation, working with FormBuilder.', 
          ru: 'Создание форм, валидация, работа с FormBuilder.' 
        },
        videoUrl: 'https://example.com/video/angular-forms.mp4',
        duration: '40:30',
        order: 5
      }
    ]
  ),
  new CourseModel(
    2,
    { 
      en: 'Advanced TypeScript', 
      ru: 'Продвинутый TypeScript' 
    },
    { 
      en: 'Programming', 
      ru: 'Программирование' 
    },
    4.8,
    'Steve Vai',
    { 
      en: 'Deep dive into TypeScript: generics, decorators, advanced types and best practices.', 
      ru: 'Глубокое погружение в TypeScript: generics, декораторы, продвинутые типы и лучшие практики.' 
    },
    [
      { 
        en: 'Master Generics', 
        ru: 'Освоить Generics' 
      },
      { 
        en: 'Understand Decorators', 
        ru: 'Понимать декораторы' 
      },
      { 
        en: 'Work with Advanced Types', 
        ru: 'Работать с продвинутыми типами' 
      },
      { 
        en: 'Study Type System', 
        ru: 'Изучить Type System' 
      }
    ],
    [
      { 
        en: 'Module 1: Generics', 
        ru: 'Модуль 1: Generics' 
      },
      { 
        en: 'Module 2: Decorators', 
        ru: 'Модуль 2: Decorators' 
      },
      { 
        en: 'Module 3: Advanced Types', 
        ru: 'Модуль 3: Advanced Types' 
      },
      { 
        en: 'Module 4: Type System', 
        ru: 'Модуль 4: Type System' 
      },
      { 
        en: 'Module 5: Best Practices', 
        ru: 'Модуль 5: Best Practices' 
      }
    ],
    'advanced',
    [
      {
        id: 1,
        title: { 
          en: 'Generics Basics', 
          ru: 'Generics основы' 
        },
        description: { 
          en: 'Introduction to Generics, generic functions and interfaces.', 
          ru: 'Введение в Generics, generic функции и интерфейсы.' 
        },
        videoUrl: 'https://example.com/video/ts-generics-basic.mp4',
        duration: '28:00',
        order: 1
      },
      {
        id: 2,
        title: { 
          en: 'Advanced Generics', 
          ru: 'Продвинутые Generics' 
        },
        description: { 
          en: 'Generic constraints, conditional types, mapped types.', 
          ru: 'Generic constraints, conditional types, mapped types.' 
        },
        videoUrl: 'https://example.com/video/ts-generics-advanced.mp4',
        duration: '35:15',
        order: 2
      },
      {
        id: 3,
        title: { 
          en: 'Decorators', 
          ru: 'Декораторы' 
        },
        description: { 
          en: 'Class decorators, method decorators, property decorators.', 
          ru: 'Class decorators, method decorators, property decorators.' 
        },
        videoUrl: 'https://example.com/video/ts-decorators.mp4',
        duration: '30:45',
        order: 3
      },
      {
        id: 4,
        title: { 
          en: 'Advanced Types', 
          ru: 'Продвинутые типы' 
        },
        description: { 
          en: 'Union types, intersection types, type guards, type assertions.', 
          ru: 'Union types, intersection types, type guards, type assertions.' 
        },
        videoUrl: 'https://example.com/video/ts-advanced-types.mp4',
        duration: '32:20',
        order: 4
      },
      {
        id: 5,
        title: { 
          en: 'Type System and Utilities', 
          ru: 'Type System и утилиты' 
        },
        description: { 
          en: 'Utility types, type inference, type compatibility.', 
          ru: 'Utility types, type inference, type compatibility.' 
        },
        videoUrl: 'https://example.com/video/ts-type-system.mp4',
        duration: '38:10',
        order: 5
      }
    ]
  ),
  new CourseModel(
    3,
    { 
      en: 'React for Beginners', 
      ru: 'React для начинающих' 
    },
    { 
      en: 'Frontend Development', 
      ru: 'Frontend разработка' 
    },
    4.3,
    'Elvis Presley',
    { 
      en: 'Learn React from scratch: components, hooks, state and API integration.', 
      ru: 'Изучите React с нуля: компоненты, хуки, состояние и работа с API.' 
    },
    [
      { 
        en: 'Understand React basics', 
        ru: 'Понимать основы React' 
      },
      { 
        en: 'Work with components and hooks', 
        ru: 'Работать с компонентами и хуками' 
      },
      { 
        en: 'Manage application state', 
        ru: 'Управлять состоянием приложения' 
      },
      { 
        en: 'Integrate with API', 
        ru: 'Интегрироваться с API' 
      }
    ],
    [
      { 
        en: 'Module 1: Introduction to React', 
        ru: 'Модуль 1: Введение в React' 
      },
      { 
        en: 'Module 2: Components and JSX', 
        ru: 'Модуль 2: Компоненты и JSX' 
      },
      { 
        en: 'Module 3: Hooks and State', 
        ru: 'Модуль 3: Хуки и состояние' 
      },
      { 
        en: 'Module 4: Working with API', 
        ru: 'Модуль 4: Работа с API' 
      },
      { 
        en: 'Module 5: Context and Routing', 
        ru: 'Модуль 5: Контекст и роутинг' 
      }
    ],
    'beginner',
    [
      {
        id: 1,
        title: { 
          en: 'Introduction to React', 
          ru: 'Введение в React' 
        },
        description: { 
          en: 'What is React, Virtual DOM, creating your first component.', 
          ru: 'Что такое React, Virtual DOM, создание первого компонента.' 
        },
        videoUrl: 'https://example.com/video/react-intro.mp4',
        duration: '22:30',
        order: 1
      },
      {
        id: 2,
        title: { 
          en: 'Components and JSX', 
          ru: 'Компоненты и JSX' 
        },
        description: { 
          en: 'Functional components, JSX syntax, props.', 
          ru: 'Функциональные компоненты, JSX синтаксис, props.' 
        },
        videoUrl: 'https://example.com/video/react-components.mp4',
        duration: '29:15',
        order: 2
      },
      {
        id: 3,
        title: { 
          en: 'useState and useEffect Hooks', 
          ru: 'Хуки useState и useEffect' 
        },
        description: { 
          en: 'Working with state, side effects, component lifecycle.', 
          ru: 'Работа с состоянием, side effects, жизненный цикл компонента.' 
        },
        videoUrl: 'https://example.com/video/react-hooks.mp4',
        duration: '34:20',
        order: 3
      },
      {
        id: 4,
        title: { 
          en: 'Working with Forms', 
          ru: 'Работа с формами' 
        },
        description: { 
          en: 'Controlled components, event handling, validation.', 
          ru: 'Контролируемые компоненты, обработка событий, валидация.' 
        },
        videoUrl: 'https://example.com/video/react-forms.mp4',
        duration: '31:45',
        order: 4
      },
      {
        id: 5,
        title: { 
          en: 'API and HTTP Requests', 
          ru: 'API и HTTP запросы' 
        },
        description: { 
          en: 'Fetch API, axios, handling loading and error states.', 
          ru: 'Fetch API, axios, обработка loading и error states.' 
        },
        videoUrl: 'https://example.com/video/react-api.mp4',
        duration: '36:10',
        order: 5
      }
    ]
  )
];