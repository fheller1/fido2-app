import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { User } from "../interfaces/user";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  url: string = "http://localhost:8080/";
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
      Authorization: 'my-auth-token'
    })
  };

  constructor(private http: HttpClient) { }

  postUser(user: User): Observable<User> {
    return this.http.post<User>(this.url + "user", user);
  }

  test(): Observable<any> {
    const user = {name: "Morpheus"};
    return this.http.post<any>("https://reqres.in/api/users", user);
  }

}
