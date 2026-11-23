import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

// CA5: "futuro" é qualquer instante depois de agora; agora já é recusado.
// O vazio fica para o Validators.required ("preenchimento obrigatório").
export const horarioFuturo: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const valor: string = control.value;
  if (!valor) return null;
  return new Date(valor).getTime() > Date.now() ? null : { horarioFuturo: true };
};
