import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { User } from "../interfaces/user";
import {Observable, throwError} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  apiUrl: string = "http://localhost:5000/"
  // apiUrl: string = "http://fido2.igd.fraunhofer.de"

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
      Authorization: 'my-auth-token'
    })
  };

  constructor(private http: HttpClient) { }

  bytesToBase64Url = (arrayBuffer: ArrayBuffer) => (
    // @ts-ignore
    btoa(String.fromCharCode.apply(null, new Uint8Array(arrayBuffer))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
  );

  getRegistrationOptions(userName: string): Observable<PublicKeyCredentialCreationOptions> {
    return this.http.post<PublicKeyCredentialCreationOptions>(this.apiUrl + "register", {userName: userName});
  }

  verifyRegistration(credential: Credential, userName: string) {
    return this.http.post<any>(this.apiUrl + "register-verify", {credential: {
      // @ts-ignore
      authenticatorAttachement: credential.authenticatorAttachement,
      id: credential.id,
      // @ts-ignore
      rawId: this.bytesToBase64Url(credential.rawId),
      response: {
        // @ts-ignore
        attestationObject: this.bytesToBase64Url(credential.response.attestationObject),
        // @ts-ignore
        clientDataJSON: this.bytesToBase64Url(credential.response.clientDataJSON)
      },
      type: credential.type
    }, userName});
  }

  getLoginOptions(userName: string): Observable<PublicKeyCredentialRequestOptions> {
    return this.http.post<PublicKeyCredentialRequestOptions>(this.apiUrl + "login", {userName: userName});
  }

  verifyLogin(assertion: Credential, userName: string) {
    console.log(assertion);
    return this.http.post<any>(this.apiUrl + "login-verify", {assertion: {
      // @ts-ignore
      authenticatorAttachement: assertion.authenticatorAttachement,
      id: assertion.id,
      // @ts-ignore
      rawId: this.bytesToBase64Url(assertion.rawId),
      response: {
        // @ts-ignore
        authenticatorData: this.bytesToBase64Url(assertion.response.authenticatorData),
        // @ts-ignore
        clientDataJSON: this.bytesToBase64Url(assertion.response.clientDataJSON),
        // @ts-ignore
        signature: this.bytesToBase64Url(assertion.response.signature)
      },
      type: assertion.type
    }, userName});
  }
  
  logout(userName: string): Observable<any> {
    return this.http.post<any>(this.apiUrl + "logout", {userName: userName});
  }

}
