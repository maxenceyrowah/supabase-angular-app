import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { routes } from './app.routes';
import { CoreModule } from './@core/core.module';
import { SharedModule } from './@shared/shared.module';
import { provideAnimations } from '@angular/platform-browser/animations';

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(CoreModule, SharedModule),
    provideRouter(routes, withComponentInputBinding()),
    provideAnimations()
],
};
