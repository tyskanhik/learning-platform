import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: '',
    renderMode: RenderMode.Server
  },
  {
    path: 'login',
    renderMode: RenderMode.Server  
  },
  {
    path: 'register', 
    renderMode: RenderMode.Server
  },
  {
    path: 'profile',
    renderMode: RenderMode.Client
  },
  {
    path: 'course/:id', 
    renderMode: RenderMode.Server
  },
  {
    path: 'lesson/:courseId/:lessonId',
    renderMode: RenderMode.Client
  },
  {
    path: 'create-course',
    renderMode: RenderMode.Client
  },
  {
    path: '**',
    renderMode: RenderMode.Client
  }
];
