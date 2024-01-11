import { Injectable } from '@angular/core';
import {Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {User} from "../interfaces/user";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private currentUser: User | null = null;
  private apiUrl: string = 'localhost:8080/';

  constructor(private router: Router, private http: HttpClient) {
    this.currentUser = JSON.parse(localStorage.getItem('user')!);
  }

  create(user: User): undefined {
    this.http.post<User>(this.apiUrl + 'user', { title: "Post user"}).subscribe(data => data);
    return;
  }

  login(username: string, password: string): void {
    const user: null = null;
    this.currentUser = user;
    localStorage.setItem('user', JSON.stringify(user));
    this.router.navigate(['']).then();
  }

  logout(): void {
    if(!localStorage.getItem('user')) return;
    localStorage.removeItem('user');
    this.currentUser = null;
    this.router.navigate(['/login']).then();
  }
}
