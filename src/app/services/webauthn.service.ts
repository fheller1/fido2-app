import { Injectable } from '@angular/core';
import {User} from "../interfaces/user";
import {HttpService} from "./http.service";
import {firstValueFrom} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class WebauthnService {

  constructor(private httpService: HttpService) {}

  async login(userName: string) {
    const options: PublicKeyCredentialRequestOptions = await firstValueFrom(this.httpService.getLoginOptions(userName));
    if (options.allowCredentials) {
      options.allowCredentials.forEach(cred => {
        // @ts-ignore
        cred.id = new Uint8Array([...atob(cred.id.replace(/-/g, '+').replace(/_/g, '/'))]
          .map(char => char.charCodeAt(0))).buffer;
        return cred;
      })
    }
    // @ts-ignore
    options.challenge = new Uint8Array([...atob(options.challenge.replace(/-/g, '+').replace(/_/g, '/'))]
      .map(char => char.charCodeAt(0))).buffer;

    const assertion = await navigator.credentials.get({
      publicKey: options
    });

    const validation = null;

    console.log(assertion);
  }

  async registration(user: User) {
    const options = await firstValueFrom(this.httpService.getOptions(user.userName)).catch(err => {return err;});
    if (options.status && options.status === 409) {
      return options;
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
      return undefined;
    }
    const verification = await firstValueFrom(this.httpService.verifyRegistration(credential, user.userName)).catch(err => {return err;});
    if (verification.status === 500 || verification.status === 404 ) {
      return verification
    }
    return user;
  }

}
