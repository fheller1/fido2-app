import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { User } from "../interfaces/user";
import {Observable, throwError} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  url: string = "http://localhost:8080/";
  pyUrl: string = "http://localhost:5000/"
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
      Authorization: 'my-auth-token'
    })
  };

  constructor(private http: HttpClient) { }

  getUser(userName: String): Observable<User> {
    return this.http.get<User>(this.url + "user/" + userName);
  }

  postUser(user: User): Observable<User> {
    return this.http.post<User>(this.url + "register", user);
  }

  getRegistrationOptions(userName: string): Observable<PublicKeyCredentialCreationOptions> {
    return this.http.post<PublicKeyCredentialCreationOptions>(this.pyUrl + "register", {userName: userName});
  }

  verifyRegistration(credential: Credential, userName: string) {
    return this.http.post<any>(this.pyUrl + "register-verify", {credential: credential, userName: userName});
  }

  getLoginOptions(userName: string): Observable<PublicKeyCredentialRequestOptions> {
    return this.http.post<PublicKeyCredentialRequestOptions>(this.pyUrl + "login", {userName: userName});
  }

  verifyLogin(assertion: Credential, userName: string) {
    return this.http.post<any>(this.pyUrl + "login-verify", {assertion, userName});
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, body was: `, error.error);
    }
    // Return an observable with a user-facing error message.
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }

}
