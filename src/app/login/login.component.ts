import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators,ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { fromEvent } from 'rxjs';
import { debounceTime, map } from 'rxjs';
// import { usernameOrEmailValidator } from './username-or-email-validator';


@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  standalone:true
})
export class LoginComponent {

invalidForm: FormGroup;
inputValueIncorrect: true | false =true

patternValidator(pattern: RegExp, error: { [key: string]: any }) {
  return (control: any) => {
    if (!control.value) {
      return null;
    }
    const valid = pattern.test(control.value);
    return valid ? null : error;
  };
}

constructor(private formbuilder: FormBuilder){
  this.invalidForm=this.formbuilder.group({
    loginMethod: ['username'],
    username:['',[Validators.required,Validators.minLength(5),Validators.maxLength(20)]],
    email:['',Validators.required,Validators.email],
    password:['',[Validators.required,Validators.minLength(5),Validators.maxLength(20),this.patternValidator(/\W/, { hasSpecialChar: true })]]
  }
  // ,{ validators: usernameOrEmailValidator() }
)
}

get loginMethod() {
  return this.invalidForm.get('loginMethod')?.value;
}


ngOnInit():void{
  //valueChanges為observable可設定pipe
  // this.invalidForm.valueChanges.pipe(

  // ).
  this.invalidForm.valueChanges.subscribe(()=>{
  this.inputValueIncorrect=this.invalidForm.invalid;
  console.log(this.invalidForm.invalid);

  })
}
get isSubmitDisabled() {
  return this.inputValueIncorrect;
}


errorMessage: string[]=[]

getErrors(controlName: string){
  const control=this.invalidForm.get(controlName)
  const errors=control?.errors
  this.errorMessage=[]
  if(errors?.['required']){
    this.errorMessage.push(`* ${controlName} 是必須的`)
  }if(errors?.['minlength']){
    this.errorMessage.push(`* ${controlName} 必須至少包含 5 個字符`)
  }if(errors?.['maxlength']){
    this.errorMessage.push(`* ${controlName} 不能超過 20 個字符`)
  } if (errors?.['hasSpecialChar']) {
    this.errorMessage.push(`* ${controlName} 需包含大寫及一個以上的特殊符號`);
  }
  return this.errorMessage
}
hasErrors(): boolean {
  return ['username', 'email', 'password'].some(field =>
    this.invalidForm.get(field)?.touched && this.invalidForm.get(field)?.invalid
  );
}

onSubmit(){

    //發送api
    console.log('Form Submitted', this.invalidForm.value);

}

}

