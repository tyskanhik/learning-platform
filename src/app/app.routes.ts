import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { teacherGuard } from './core/guards/teacher.guard';

export const routes: Routes = [
  { 
    path: '', 
    loadComponent: () => import('./layout/home/home').then(m => m.Home),
    title: 'Learning Platform - Главная'
  },
  { 
    path: 'login', 
    loadComponent: () => import('./features/login/login').then(m => m.Login ),
    title: 'Learning Platform - Вход'
  },
  { 
    path: 'register', 
    loadComponent: () => import('./features/register/register').then(m => m.Register),
    title: 'Learning Platform - Регистрация'
  },
  { 
    path: 'profile', 
    loadComponent: () => import('./features/profile/profile').then(m => m.Profile),
    title: 'Learning Platform - Профиль',
    canActivate: [authGuard]
  },
  { 
    path: 'course/:id', 
    loadComponent: () => import('./features/course-details/course-details').then(m => m.CourseDetails),
    title: 'Learning Platform - Курс'
  },
  { 
    path: 'lesson/:courseId/:lessonId', 
    loadComponent: () => import('./features/lesson/lesson').then(m => m.Lesson),
    title: 'Learning Platform - Урок',
    canActivate: [authGuard]
  },
  { 
    path: 'create-course', 
    loadComponent: () => import('./features/create-course/create-course').then(m => m.CreateCourse),
    title: 'Learning Platform - Создание курса',
    canActivate: [authGuard, teacherGuard]
  },
  { path: '**', redirectTo: '' }
];
