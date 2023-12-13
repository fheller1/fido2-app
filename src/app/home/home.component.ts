import { Component } from '@angular/core';
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  template: `
      <h1>Home component</h1>
  `,
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
