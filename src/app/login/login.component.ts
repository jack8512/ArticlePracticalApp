import { FetchAPIService } from './../services/fetch-api.service';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators,ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { debounceTime, map } from 'rxjs';
import { atLeastOneRequiredValidator, specialCharValidator } from '../shared/validators/special-validators';
import { ApiResponse } from '../interfaces/employee.interface';
import { HttpResponse } from '@angular/common/http';


@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  standalone:true
})
export class LoginComponent {

invalidForm!: FormGroup;
inputValueIncorrect: true | false =true
errorMessage: string[]=[]

constructor(private formBuilder: FormBuilder, private fetchAPIService:FetchAPIService){}

get loginMethod() {
  return this.invalidForm.get('loginMethod')?.value;
}

ngOnInit():void{
  //valueChanges為observable可設定pipe
  this.invalidForm = this.formBuilder.group({
    loginMethod: ['username'],
    username: ['', [Validators.minLength(5), Validators.maxLength(20)]],
    email: ['',  Validators.email],
    password: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(20),specialCharValidator()]]
  },{validators: [atLeastOneRequiredValidator()]}
);

  this.invalidForm.valueChanges.pipe(
    debounceTime(500)
  ).subscribe(() => {
    if(!this.invalidForm.touched){
      this.invalidForm.markAsTouched()
    }
    this.inputValueIncorrect = this.invalidForm.invalid;
  });
}


get isSubmitDisabled() {
  return this.inputValueIncorrect;
}

getErrors(controlName: string){
  const control=this.invalidForm.get(controlName)
  const errors=control?.errors
  this.errorMessage=[]
  if (this.invalidForm.errors?.['atLeastOneRequired']) {
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
hasErrors(): boolean {
  const hasFormError=this.invalidForm.touched && this.invalidForm.errors?.['atLeastOneRequired']
  const hasFieldErrors=['username','email','password'].some(field=>{
    const control = this.invalidForm.get(field)
    return control?.touched && control?.invalid
  })
  return hasFieldErrors || hasFormError
}

onSubmit(){
  const formValue=this.invalidForm.value
    //發送api
    this.fetchAPIService.login(formValue).subscribe({
      next:(res:HttpResponse<ApiResponse>)=>{
        if(res.status===200){
          this.invalidForm.patchValue({
            username:'',
            email:'',
            password:''
          })
          //彈窗
          alert(res.body?.message)
        }
      },
      error:(err)=>{
        alert(err.error?.message || '未知錯誤')
      }
    })
}

}

