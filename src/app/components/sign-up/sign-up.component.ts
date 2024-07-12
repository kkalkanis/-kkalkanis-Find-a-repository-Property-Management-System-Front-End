import { Component, OnInit } from '@angular/core';

import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../../classes/user';
import { NoEmptySpacesAllowedValidator } from '../../validators/no-empty-spaces-allowed-validator';
import { NoSamePasswordsValidator } from '../../validators/no-same-passwords-validator';
import { NumberOfRooomsValidator } from '../../validators/number-of-roooms-validator';

import { RegisterValidator } from '../../validators/register-validator';
import { AuthService } from '../../_services/auth.service';
@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {
  selectedRole: string[] = ['Admin'];
  submitted: boolean = false;
  samePassword: boolean = false;
  registerFormGroup!: FormGroup;
  user: User = new User;
  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';
  constructor(private formBuilder: FormBuilder,
    private signUpService: AuthService,
    private router: Router) { }

  roleHandler(event:any) {
    this.selectedRole[0] = event.target.value;
    console.log("role " + this.selectedRole[0]);
  }

  ngOnInit(): void {
    this.registerFormGroup = this.formBuilder.group({

      username: new FormControl('',
        [Validators.required,
          Validators.minLength(6),
          NoEmptySpacesAllowedValidator.notWhitespaceAtAll]),

      email: new FormControl('',
        [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]),

      password: new FormControl('',
         [Validators.required,
          Validators.minLength(6),
          NoEmptySpacesAllowedValidator.notWhitespaceAtAll]),

      repeat_password: new FormControl('',
        [Validators.required,
        Validators.minLength(6),
          NoEmptySpacesAllowedValidator.notWhitespaceAtAll,
          NoSamePasswordsValidator.notSamePasswords]),
    });
  }
  //Getters for formGroup fields
  get username() { return this.registerFormGroup.get('username');}
  get email() { return this.registerFormGroup.get('email'); }
  get password() { return this.registerFormGroup.get('password'); }
  get repeat_password() { return this.registerFormGroup.get('repeat_password'); }
 
  submit() {
    this.submitted = true;
    if (this.registerFormGroup.invalid) {
      this.registerFormGroup.markAllAsTouched();
      return;
    }
    this.user.username = this.registerFormGroup.value.username;
    this.user.password = this.registerFormGroup.value.password;
    this.user.email = this.registerFormGroup.value.email;
    this.user.hotel_name = this.registerFormGroup.value.hotel_name;
    this.user.number_of_rooms = this.registerFormGroup.value.number_of_rooms;

    this.signUpService.register(this.user.username, this.user.password, this.user.email, this.selectedRole
      ).subscribe({
      next: data => {
        console.log(data);
        this.isSignUpFailed = false;
        this.isSuccessful = true;
        this.router.navigate(['/login']);
      },
      error: err => {
        this.errorMessage = err.error.message;
        console.log(this.errorMessage);
        this.isSignUpFailed = true;

        setTimeout(() => {
          this.submitted = false;
          this.isSignUpFailed = false;
        }, 3000);

      }
    });
  }
     

}

