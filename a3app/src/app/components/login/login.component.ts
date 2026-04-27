import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Login } from '../../models/login';
import { FormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  login: Login = new Login();

  constructor(private as: AuthService, private router: Router) { }

  loginAuth() {

    this.as.login(this.login).subscribe(
      {
        next: (data: any) => {
          console.log(data);
          this.router.navigate(['dashboard']);
        },
        error: (error: any) => {
          this.router.navigate(['invalid-data']);
        }
      }
    )
  }

  switchSignup() {
    this.router.navigate(['signup']);
  }

}
