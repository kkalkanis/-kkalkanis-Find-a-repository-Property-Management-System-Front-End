import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginPostData } from '../../classes/login-post-data';
import { User } from '../../classes/user';

import { RegisterValidator } from '../../validators/register-validator';
import { AuthService } from '../../_services/auth.service';
import { TokenStorageService } from '../../_services/token-storage.service';
import { SideBarComponent } from '../side-bar/side-bar.component';


@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.css']
})
export class LogInComponent implements OnInit {
  username!: string;
  loginFormGroup !: FormGroup;
  loginPostData = new LoginPostData;
  user: User = new User;
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = 'Bad Credentials';
  roles: string[] = [];
  static isLoggedIn: boolean;
  
  constructor(private formBuilder: FormBuilder,
    private loginService: AuthService,
    private tokenStorage: TokenStorageService,
    private router: Router) { }

  ngOnInit(): void {
    if (this.tokenStorage.getToken()) {
      this.isLoggedIn = true;
      this.roles = this.tokenStorage.getUser().roles;
    }

    this.loginFormGroup = this.formBuilder.group({

      username: new FormControl('',
        [Validators.required,
        Validators.minLength(2),
        RegisterValidator.notOnlyWhitespace]),

      password: new FormControl('',
        [Validators.required,
        Validators.minLength(2),
        RegisterValidator.notOnlyWhitespace]),

     

    });
  }
  submit(): void {
    this.user.username = this.loginFormGroup.value.username;
    this.user.password = this.loginFormGroup.value.password;

    this.loginService.login(this.user.username, this.user.password).subscribe({
      next: data => {
        localStorage.setItem('logedInUsername', this.user.username);
        localStorage.setItem('logedInRole', data.roles[0]);
        this.tokenStorage.saveToken(data.accessToken);
        console.log(data.accessToken);
        this.tokenStorage.saveUser(data);
        this.isLoginFailed = false;
        this.isLoggedIn = true;
        this.roles = this.tokenStorage.getUser().roles;
        this.router.navigate(['/userDashboard/availabilityByRoomNumber']);
      },
      error: err => {
        this.errorMessage = err.error.message;
        this.isLoginFailed = true;
        setTimeout(() => {
          this.isLoginFailed = false;
          this.loginFormGroup.reset();
        }, 3000);
      }
    });
    
  }

}
