import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {WebauthnService} from "../services/webauthn.service"

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  constructor(private router: Router, private webauthn: WebauthnService) {}

  userName: string = '';

  ngOnInit() {
    const userName = localStorage.getItem('userName');
    if (!userName || userName.trim() === '') {
      console.log('User not logged in! Redirecting to login page...');
      this.router.navigate(['/login']);
      return;
    }
    this.userName = userName;
  }


  logout(): void {
    console.log('Logging out...');
    this.webauthn.logout();
    this.router.navigate(['/login']);
  }

}
