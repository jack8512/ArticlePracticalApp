import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators,ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { debounceTime, map, catchError, throwError, tap, distinctUntilChanged, retry } from 'rxjs';
import { atLeastOneRequiredValidator, specialCharValidator } from '../shared/validators/special-validators';
import { ApiResponse } from '../interfaces/interface';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { HeaderComponent } from '../header/header.component';


@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule,CommonModule, RouterModule, HeaderComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  standalone:true
})
export class LoginComponent {

loginForm!: FormGroup;

constructor(private formBuilder: FormBuilder, private userService:UserService, private authService: AuthService, private router: Router){}

get loginMethod() {
  return this.loginForm.get('loginMethod')?.value;
}

ngOnInit():void{
  this.loginForm = this.formBuilder.group({
    loginMethod: ['username'],
    username: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(20)]],
    email: ['',  Validators.required, Validators.email],
    password: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(20),specialCharValidator()]]
},{validators: [atLeastOneRequiredValidator()]}
);

  this.loginForm.get('loginMethod')?.valueChanges.subscribe(()=>{
    ['username','email'].forEach(field => {
      const control=this.loginForm.get(field);
      control?.setValue('');
      control?.markAsPristine();
      control?.markAsUntouched();
    })
  })

  this.loginForm.valueChanges.pipe(
    debounceTime(300)
  ).subscribe(formValue => {
    const usernameCtrl = this.loginForm.get('username');
    const emailCtrl = this.loginForm.get('email');

    if (formValue.username && !formValue.email) {
      emailCtrl?.clearValidators();
      emailCtrl?.setValidators([Validators.email]);
      emailCtrl?.updateValueAndValidity();
    }if (!formValue.username && formValue.email) {
      usernameCtrl?.clearValidators();
      usernameCtrl?.setValidators([
        Validators.minLength(5),
        Validators.maxLength(20)
      ]);
      usernameCtrl?.updateValueAndValidity();
    }

    if(!this.loginForm.touched){
      this.loginForm.markAsTouched()
    }
  });

}

get isSubmitDisabled() {
  return this.hasErrors().hasFormError||this.hasErrors().hasFieldErrors
}

getErrors(controlName: string){
  const control=this.loginForm.get(controlName)
  const errors=control?.errors
  const errorMessage: string[]=[]
  if(errors?.['required']&& !this.loginForm.errors){
    errorMessage.push(`* ${controlName} 為必填項目`)
  }if(errors?.['minlength']){
    errorMessage.push(`* ${controlName} 必須至少包含 5 個字符`)
  }if(errors?.['maxlength']){
    errorMessage.push(`* ${controlName} 不能超過 20 個字符`)
  } if (errors?.['specialCharRequired']) {
    errorMessage.push(`* ${controlName} 需包含大寫及一個以上的特殊符號`);
  }
  if (errors?.['email']) {
    errorMessage.push(`* 請輸入有效的電子郵件地址`);
  }
  return errorMessage
}
getFormErrors(): string[] {
  const errors = this.loginForm.errors;
  const errorMessage: string[] = [];
  if (errors?.['atLeastOneRequired']) {
    errorMessage.push(`* 請輸入用戶名稱或電子郵件`);
  }
  return errorMessage;
}

hasErrors() {
  const hasFormError=this.loginForm.touched && this.loginForm.errors?.['atLeastOneRequired']
  const hasFieldErrors=['username','email','password'].some(field=>{
    const control = this.loginForm.get(field)
    return control?.touched && control?.invalid
  })
  return { hasFormError, hasFieldErrors };
}

onSubmit(){
  // this.loginForm.removeControl('loginMethod');
  const {loginMethod, ...formValue}=this.loginForm.value
    this.userService.login(formValue).
    pipe(
      map((res : HttpResponse<ApiResponse>)=>{
      if(res.status===200){
        const token=res.body?.token
        alert(res.body?.message)
        this.authService.saveToken(token)
        this.router.navigateByUrl('/mainpage');
        return
      }return  console.error('Login failed', res); //這邊要補充錯誤處理
    }),
    catchError((err: HttpErrorResponse)=>{
      alert(err.error?.message);
      ['username','email', 'password'].forEach(field => {
        this.loginForm.get(field)?.reset();
      });
      // this.loginForm.addControl('loginMethod',new FormControl('username'))
      return throwError(()=>err)
    }),
    retry(3)

    ).subscribe()
  }

}

