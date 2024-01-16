import { Component } from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {NgIf, NgStyle} from "@angular/common";
import {WebauthnService} from "../services/webauthn.service"
import {User} from "../interfaces/user";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, NgStyle],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  providers: [WebauthnService]
})
export class LoginComponent {

  constructor(private webauthn: WebauthnService) {}

  showRegisterInputs: boolean = false;
  statusText: string = '';
  statusColor: string = 'red';

  loginForm = new FormGroup(
    { username: new FormControl(''), firstname: new FormControl(''), lastname: new FormControl('') }
  );

  async register() {
    this.statusText = '';
    if (!this.loginForm.controls.username.value) {
      return;
    }
    const user: User = new User(
      this.loginForm.controls.username.value
    );
    const returnedUser : User | null = await this.webauthn.registration(user);
    console.log(returnedUser);
  }

  async login(): Promise<void> {
    this.statusText = '';
    if(!this.loginForm.controls.username.value) {
      this.statusColor = 'red';
      this.statusText = 'Please provide a username.'
      return;
    }
    const response: number = await this.webauthn.login(this.loginForm.controls.username.value);
    if (response === 0) {
      this.statusColor = 'green';
      this.statusText = 'Successfully authenticated identity!'
    }
    else if (response === 1) {
      this.statusColor = 'red';
      this.statusText = 'This user is not registered in the database.'
    } 
    else if (response === 2) {
      this.statusColor = 'red';
      this.statusText = 'An error occured while attempting to obtain the credential. Please try again.'
    }
    else if (response === 3) {
      this.statusColor = 'red';
      this.statusText = 'An error occured while attempting to verify the credential. Please try again.'
    }
  }

  openRegister(): void {
    this.showRegisterInputs = true;
  }

  hideRegister(): void {
    this.showRegisterInputs = false;
  }

}
