import { Injectable } from '@angular/core';
import {Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {User} from "../interfaces/user";

@Injectable({
  providedIn: 'root'
})
export class WebauthnService {

  constructor(private router: Router, private http: HttpClient) { }

  registration(user: User): Promise<Credential | null> {
    const randomStringFromServer: string = "9g5rRuxfaL8WLJnc"; //TODO: replace this with server call
    const publicKeyCredentialCreationOptions = {
      challenge: Uint8Array.from(
        randomStringFromServer, c => c.charCodeAt(0)),
      rp: {
        name: "Ambient Intelligence Mini-Praktikum",
        id: "localhost", //TODO: replace with sub-url if rolling this out on actual url
      },
      user: {
        id: Uint8Array.from(
          user.id, c => c.charCodeAt(0)),
        name: user.username,
        displayName: user.firstname,
      },
      pubKeyCredParams: [{alg: -7, type: "public-key"}],
      authenticatorSelection: {
        authenticatorAttachment: "cross-platform",
      },
      timeout: 60000,
      attestation: "direct"
    };

    return navigator.credentials.create({
      // @ts-ignore
      publicKey: publicKeyCredentialCreationOptions
    });
  }

}
