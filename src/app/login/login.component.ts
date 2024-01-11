import { Component } from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {NgIf} from "@angular/common";
import {WebauthnService} from "../services/webauthn.service"
import {User} from "../interfaces/user";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  providers: [WebauthnService]
})
export class LoginComponent {

  constructor(private webauthn: WebauthnService) {}

  showRegisterInputs: boolean = false;

  loginForm = new FormGroup(
    { username: new FormControl(''), firstname: new FormControl(''), lastname: new FormControl('') }
  );

  async register() {
    if (!this.loginForm.controls.username.value || !this.loginForm.controls.firstname.value || !this.loginForm.controls.lastname.value) {
      return;
    }
    const user: User = new User(
      this.loginForm.controls.username.value,
      this.loginForm.controls.firstname.value,
      this.loginForm.controls.lastname.value
    );
    const returnedUser : User | null = await this.webauthn.registration(user);
    console.log(returnedUser);
  }

  login(): void {
    if(!this.loginForm.controls.username.value) return;
    this.webauthn.login(this.loginForm.controls.username.value).then();
  }

  openRegister(): void {
    this.showRegisterInputs = true;
  }

  hideRegister(): void {
    this.showRegisterInputs = false;
  }

}
