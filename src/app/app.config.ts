import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { TranslocoHttpLoader } from './transloco-loader';
import { provideTransloco } from '@jsverse/transloco';
import { provideStore } from '@ngrx/store';
import { reducers } from './core/store';
import { provideEffects } from '@ngrx/effects';
import { CourseEffects } from './core/store/course/course.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes), provideClientHydration(withEventReplay()), provideHttpClient(withFetch()), provideTransloco({
        config: {
            availableLangs: ['ru', 'en'],
            defaultLang: 'ru',
            // Remove this option if your application doesn't support changing language in runtime.
            reRenderOnLangChange: true,
            prodMode: !isDevMode(),
        },
        loader: TranslocoHttpLoader
    }),
    provideStore(reducers),
    provideEffects([CourseEffects])
]
};
