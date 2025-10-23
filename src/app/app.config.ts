import { ApplicationConfig, provideZoneChangeDetection, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { TranslocoHttpLoader } from './transloco-loader';
import { provideTransloco } from '@jsverse/transloco';
import { provideStore } from '@ngxs/store';
import { withNgxsReduxDevtoolsPlugin } from '@ngxs/devtools-plugin';
import { UserState } from './core/store/user.state';
import { CourseState } from './core/store/course.state';


export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes), 
    provideClientHydration(withEventReplay()), 
    provideHttpClient(withFetch()), 
    provideTransloco({
        config: {
            availableLangs: ['ru', 'en'],
            defaultLang: 'ru',
            reRenderOnLangChange: true,
            prodMode: !isDevMode(),
        },
        loader: TranslocoHttpLoader
    }),
    provideStore(
      [UserState, CourseState],
      withNgxsReduxDevtoolsPlugin({
        disabled: !isDevMode() 
      })
    )
  ]
};