import { Injectable } from '@angular/core';
import {User} from "../interfaces/user";
import {HttpService} from "./http.service";
import {firstValueFrom} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class WebauthnService {

  constructor(private httpService: HttpService) {}

  async login(userName: String) {
    let credentialId: string = "";
    this.httpService.getUser(userName).subscribe((obj: any) => {
      credentialId = obj.credentialId;
    });
    const randomStringFromServer: string = "9g5rRuxfaL8WLJnc"; //TODO: replace this with server call
    const publicKeyCredentialRequestOptions = {
      challenge: Uint8Array.from(
        randomStringFromServer, c => c.charCodeAt(0)),
      //allowCredentials: [{
      //  id: Uint8Array.from(
      //    credentialId, c => c.charCodeAt(0)),
      //  type: 'public-key',
      //}],
      timeout: 60000,
    }

    const assertion = await navigator.credentials.get({
      // @ts-ignore
      publicKey: publicKeyCredentialRequestOptions
    });
  }

  async registration(user: User): Promise<User | null> {
    const options = await firstValueFrom(this.httpService.getOptions(user.userName));
    // @ts-ignore convert base64url string representation to byte array
    options.challenge = new Uint8Array([...atob(options.challenge.replace(/-/g, '+').replace(/_/g, '/'))]
      .map(char => char.charCodeAt(0))).buffer;
    // @ts-ignore convert base64url string representation to byte array
    options.user.id = new Uint8Array([...atob(options.user.id.replace(/-/g, '+').replace(/_/g, '/'))]
      .map(char => char.charCodeAt(0))).buffer;
    const credential: Credential | null = await navigator.credentials.create({
      publicKey: options
    });
    if (credential === null) {
      console.log('Credential creation failed!');
      return null;
    }
    this.httpService.verifyRegistration(credential, user.userName).subscribe();
    return null;
  }

}
