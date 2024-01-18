import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  constructor(private router: Router) {}

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
}
