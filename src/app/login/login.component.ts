import { Component } from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  showRegisterInputs: boolean = false;

  loginForm = new FormGroup(
    { username: new FormControl(''), firstname: new FormControl(''), lastname: new FormControl('') }
  );

  login(): void {
    if(!this.loginForm.controls.username.value) return;
    console.log('Login user ' + this.loginForm.controls.username.value);
  }

  openRegister(): void {
    this.showRegisterInputs = true;
  }

  hideRegister(): void {
    this.showRegisterInputs = false;
  }

  async register(): Promise<void> {
    if (!this.loginForm.controls.username.value || !this.loginForm.controls.firstname.value || !this.loginForm.controls.lastname.value) {
      return;
    }

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
          this.loginForm.controls.username.value, c => c.charCodeAt(0)),
        name: this.loginForm.controls.username.value,
        displayName: this.loginForm.controls.firstname.value,
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

    const credential = await navigator.credentials.create({
      // @ts-ignore
      publicKey: publicKeyCredentialCreationOptions
    });

    console.log(credential);
  }

  protected readonly open = open;
}
