import { Injectable } from '@angular/core';
import {User} from "../interfaces/user";
import {HttpService} from "./http.service";
import {firstValueFrom} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class WebauthnService {

  constructor(private httpService: HttpService) {}

  async login(userName: string): Promise<number> {
    let status: number = 0;
    // @ts-ignore
    const options: PublicKeyCredentialRequestOptions = await firstValueFrom(this.httpService.getLoginOptions(userName))
       .catch(err => {if (err.status === 404) status = 404;});
    if (status === 404) {
      return 1;
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
    });
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
      return 0;
    }
  }

  async registration(user: User): Promise<number> {
    const options = await firstValueFrom(this.httpService.getRegistrationOptions(user.userName)).catch(err => {return err;});
    if (options.status && options.status === 409) {
      return 1;
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
    });
    if (credential === null) {
      console.log('Credential creation failed!');
      return 2;
    }
    const verification = await firstValueFrom(this.httpService.verifyRegistration(credential, user.userName)).catch(err => {return err;});
    if (verification.status === 500 || verification.status === 404 ) {
      return 3;
    }
    return 0;
  }

}
