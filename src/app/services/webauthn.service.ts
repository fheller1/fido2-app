import { Injectable } from '@angular/core';
import {User} from "../interfaces/user";
import {HttpService} from "./http.service";

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
    const randomStringFromServer: string = "9g5rRuxfaL8WLJnc"; //TODO: replace this with server call
    const publicKeyCredentialCreationOptions = {
      challenge: Uint8Array.from(
        randomStringFromServer, c => c.charCodeAt(0)),
      rp: {
        name: "Ambient Intelligence Mini-Praktikum",
        id: "localhost", //TODO: replace with sub-url if rolling this out on actual url
      },
      user: {
        id: Uint8Array.from(user.userName, c => c.charCodeAt(0)),
        name: user.userName,
        displayName: user.firstName
      },
      pubKeyCredParams: [
        {
          type: "public-key",
          alg: -7
        },
        {
          type: "public-key",
          alg: -257
        }
      ],
      authenticatorSelection: {
        authenticatorAttachment: "platform",
        residentKey: "preferred",
        requireResidentKey: false,
        userVerification: "preferred"
      },
      timeout: 60000,
      attestation: "direct",
      hints: [],
      extensions: {
        credProps: true
      }
    };

    const credential: Credential | null = await navigator.credentials.create({
      // @ts-ignore
      publicKey: publicKeyCredentialCreationOptions
    });
    if (credential === null) return null;
    user.credentialId = credential.id;
    this.httpService.postUser(user).subscribe((obj: any) => {
      user = obj;
    });
    return user;
  }

}
