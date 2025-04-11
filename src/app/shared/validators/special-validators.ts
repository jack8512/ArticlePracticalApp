import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';

export function atLeastOneRequiredValidator(): ValidatorFn {
return (control: AbstractControl): ValidationErrors | null=>{
  const formGroup=control as FormGroup
  const username=formGroup.get('username')?.value;
  const email=formGroup.get('email')?.value;

  if(!username&&!email){
    return{
      atLeastOneRequired:true
    }
  }
  return null
}
}

export function specialCharValidator(): ValidatorFn{
  return (control: AbstractControl): ValidationErrors | null =>{
    if(!control.value){
      return null;
    }
    const hasUpperCAse= /[A-Z]/.test(control.value);
    const hasSpecialChar=/\W/.test(control.value);
    if(!hasSpecialChar||!hasUpperCAse){
      return {specialCharRequired:true}
    }
    return null
  }
}
