import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule } from '@angular/router';
import { HomeComponent } from "./home/home.component";
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule, HomeComponent, HttpClientModule],
  template: `
      <main>
          <a [routerLink]="['/']">
              <header class="brand-name">
                  <img class="brand-logo" src="/assets/Fraunhofer_IGD_logo.png" alt="logo" aria-hidden="true">
              </header>
          </a>
          <section class="content">
              <router-outlet></router-outlet>
          </section>
      </main>
  `,
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Hello';
}
