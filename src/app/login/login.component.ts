import { Component } from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {NgIf, NgStyle} from "@angular/common";
import {WebauthnService} from "../services/webauthn.service"
import {User} from "../interfaces/user";
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, NgStyle],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  providers: [WebauthnService]
})
export class LoginComponent {

  constructor(private webauthn: WebauthnService, private router: Router) {}

  showRegisterInputs: boolean = false;
  statusText: string = '';
  statusColor: string = 'red';
  buttonsActive: boolean = true;

  loginForm = new FormGroup(
    { username: new FormControl(''), firstname: new FormControl(''), lastname: new FormControl('') }
  );

  async register() {
    this.buttonsActive = false;
    this.statusText = '';
    if(!this.loginForm.controls.username.value) {
      this.statusColor = 'red';
      this.statusText = 'Please provide a username.'
      this.buttonsActive = true;
      return;
    }
    const user: User = new User(
      this.loginForm.controls.username.value
    );
    const response: number = await this.webauthn.registration(user);
    if (response === 0) {
      this.statusColor = 'green';
      this.statusText = 'Successfully registered user! You can now log in.'
    }
    else if (response === 1) {
      this.statusColor = 'red';
      this.statusText = 'This user is already registered. Please log in instead.'
    } 
    else if (response === 2) {
      this.statusColor = 'red';
      this.statusText = 'An error occured while attempting to create the credential. Please try again.'
    }
    else if (response === 3) {
      this.statusColor = 'red';
      this.statusText = 'An error occured while attempting to verify the credential. Please try again.'
    }
    this.buttonsActive = true;
  }

  async login(): Promise<void> {
    this.buttonsActive = false;
    this.statusText = '';
    if(!this.loginForm.controls.username.value) {
      this.statusColor = 'red';
      this.statusText = 'Please provide a username.'
      this.buttonsActive = true;
      return;
    }
    this.statusColor = 'black';
    this.statusText = 'Authenticating, please wait.';
    const response: number = await this.webauthn.login(this.loginForm.controls.username.value);
    if (response === 0) {
      this.statusColor = 'green';
      this.statusText = 'Successfully authenticated identity!'
      this.buttonsActive = true;
      this.router.navigate(['/']);
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
    this.buttonsActive = true;
  }

  openRegister(): void {
    this.showRegisterInputs = true;
  }

  hideRegister(): void {
    this.showRegisterInputs = false;
  }

}
