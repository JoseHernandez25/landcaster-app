import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ValidatorService {

  constructor() { }

  validateInput(form: FormGroup, input: string): boolean | null {
    return form.controls[input].errors && form.controls[input].touched;
  }
  
}
