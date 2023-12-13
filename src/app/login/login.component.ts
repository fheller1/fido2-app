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

  register(): void {
    if(!this.loginForm.controls.username.value || !this.loginForm.controls.firstname.value || !this.loginForm.controls.lastname.value) {
      return;
    }
    console.log('Register');
  }

  protected readonly open = open;
}
