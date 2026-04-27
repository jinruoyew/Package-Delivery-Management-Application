import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Signup } from '../../models/signup';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {

  signup: Signup = new Signup();

  constructor(private as: AuthService, private router: Router) { }

  signupAuth() {
      
      this.as.signup(this.signup).subscribe(
        {
          next: (data: any) => {
            console.log(data);
            this.router.navigate(['login']);
          },
          error: (error: any) => {
            this.router.navigate(['invalid-data']);
          }
        }
      )
  }

  switchLogin() {
    this.router.navigate(['login']);
  }

}
