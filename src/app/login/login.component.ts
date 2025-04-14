import { FetchAPIService } from './../services/fetch-api.service';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators,ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { debounceTime, map, catchError, throwError, tap } from 'rxjs';
import { atLeastOneRequiredValidator, specialCharValidator } from '../shared/validators/special-validators';
import { ApiResponse } from '../interfaces/employee.interface';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';


@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  standalone:true
})
export class LoginComponent {

loginForm!: FormGroup;
errorMessage: string[]=[]


constructor(private formBuilder: FormBuilder, private fetchAPIService:FetchAPIService){}

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
      usernameCtrl?.updateValueAndValidity({ onlySelf: true, emitEvent: false });
    }

    if(!this.loginForm.dirty){
      this.loginForm.markAsTouched()
    }
  });
  this.loginForm.get('loginMethod')?.valueChanges.pipe(tap(()=>{
    ['username','email'].forEach(field => {
      this.loginForm.get(field)?.reset();
    })
  })).subscribe()
}


get isSubmitDisabled() {
  if(this.hasErrors().hasFormError||this.hasErrors().hasFieldErrors){
    return true
  }
  return false
}



getErrors(controlName: string){
  const control=this.loginForm.get(controlName)
  const errors=control?.errors
  this.errorMessage=[]
  if (this.loginForm.errors?.['atLeastOneRequired']) {
    this.errorMessage.push(`* 請輸入用戶名稱或電子郵件`);
  }
  if(errors?.['required']){
    this.errorMessage.push(`* ${controlName} 為必填項目`)
  }if(errors?.['minlength']){
    this.errorMessage.push(`* ${controlName} 必須至少包含 5 個字符`)
  }if(errors?.['maxlength']){
    this.errorMessage.push(`* ${controlName} 不能超過 20 個字符`)
  } if (errors?.['specialCharRequired']) {
    this.errorMessage.push(`* ${controlName} 需包含大寫及一個以上的特殊符號`);
  }
  if (errors?.['atLeastOneRequired']) {
    this.errorMessage.push(`* 請輸入用戶名稱或電子郵件`);
  }
  if (errors?.['email']) {
    this.errorMessage.push(`* 請輸入有效的電子郵件地址`);
  }
  return this.errorMessage
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
    this.fetchAPIService.login(formValue).
    pipe(
      map((res : HttpResponse<ApiResponse>)=>{
      if(res.status===200){
        alert(res.body?.message)
      }return
    }),
    catchError((err: HttpErrorResponse)=>{
      alert(err.error?.message);
      ['username','email', 'password'].forEach(field => {
        this.loginForm.get(field)?.reset();
      });
      // this.loginForm.addControl('loginMethod',new FormControl('username'))
      return throwError(()=>err)
    })

    ).subscribe()
}

}

