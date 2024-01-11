import { Injectable } from '@angular/core';
import {Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {User} from "../interfaces/user";

@Injectable({
  providedIn: 'root'
})
export class WebauthnService {

  constructor() { }

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
        id: Uint8Array.from(user.id, c => c.charCodeAt(0)),
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

    return navigator.credentials.create({
      // @ts-ignore
      publicKey: publicKeyCredentialCreationOptions
    });
  }

}
