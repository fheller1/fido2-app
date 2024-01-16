import { bootstrapApplication, provideProtractorTestingSupport } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from "@angular/router";
import { HttpClientModule } from "@angular/common/http";
import routeConfig from "./app/routes";
import {importProvidersFrom} from "@angular/core";
import { CommonModule } from "@angular/common";

bootstrapApplication(AppComponent,
  {
    providers: [
      provideProtractorTestingSupport(),
      provideRouter(routeConfig),
      importProvidersFrom(HttpClientModule)
    ]
  }
).catch(err => console.error(err));
