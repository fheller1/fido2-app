import { Injectable } from '@angular/core';
import {User} from "../interfaces/user";
import {HttpService} from "./http.service";
import {firstValueFrom} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class WebauthnService {

  constructor(private httpService: HttpService) {}

  async logout(): Promise<void> {
    const userName = localStorage.getItem('userName');
    const session = localStorage.getItem('session');
    localStorage.removeItem('userName');
    localStorage.removeItem('session');
    if (userName && session) {
      await firstValueFrom(this.httpService.logout(userName));
    }
  }

  async login(userName: string): Promise<number> {
    let status: number = 200;
    // @ts-ignore
    const options: PublicKeyCredentialRequestOptions = await firstValueFrom(this.httpService.getLoginOptions(userName))
       .catch(err => {status = err.status});
    if (status === 500) {
      return 5;
    }
    if (status === 0) {
      return 4;
    }
    if (status === 404) {
      return 1;
    }
    if (status !== 200) {
      return 6;
    }
    if (options.allowCredentials) {
      options.allowCredentials.forEach(credential => {
        // @ts-ignore
        credential.id = new Uint8Array([...atob(credential.id.replace(/-/g, '+').replace(/_/g, '/'))]
          .map(char => char.charCodeAt(0))).buffer;
        return credential;
      })
    }
    // @ts-ignore
    options.challenge = new Uint8Array([...atob(options.challenge.replace(/-/g, '+').replace(/_/g, '/'))]
      .map(char => char.charCodeAt(0))).buffer;

    const assertion = await navigator.credentials.get({
      publicKey: options
    }).catch(err => {return null});
    if (assertion === null) {
      console.log('Assertion creation failed!');
      return 2;
    }

    const response = await firstValueFrom(this.httpService.verifyLogin(assertion, userName));
    if (response.status === 404 || response.status === 403) {
      return 3;
    } else {
      localStorage.setItem('userName', userName);
      localStorage.setItem('session', response.session);
      return 200;
    }
  }

  async registration(user: User): Promise<number> {
    let status: number = 200
    const options = await firstValueFrom(this.httpService
      .getRegistrationOptions(user.userName))
      .catch(err => {status = err.status});
      if (status === 500) {
        return 5;
      }
      if (status === 0) {
        return 4;
      }
      if (status === 409) {
        return 1;
      }
      if (status !== 200) {
        return 6;
      }
    // @ts-ignore convert base64url string representation to byte array
    options.challenge = new Uint8Array([...atob(options.challenge.replace(/-/g, '+').replace(/_/g, '/'))]
      .map(char => char.charCodeAt(0))).buffer;
    // @ts-ignore convert base64url string representation to byte array
    options.user.id = new Uint8Array([...atob(options.user.id.replace(/-/g, '+').replace(/_/g, '/'))]
      .map(char => char.charCodeAt(0))).buffer;
    const credential: Credential | null = await navigator.credentials.create({
      // @ts-ignore
      publicKey: options
    }).catch(err => {return null});
    if (credential === null) {
      console.log('Credential creation failed!');
      return 2;
    }
    const verification = await firstValueFrom(this.httpService
      .verifyRegistration(credential, user.userName))
      .catch(err => {status = err.status});
    // @ts-ignore
    if (status === 500) {
      return 5;
    }
    // @ts-ignore
    if (status === 0) {
      return 4;
    }
    if (status !== 200) {
      return 6;
    }
    return 200;
  }

}
