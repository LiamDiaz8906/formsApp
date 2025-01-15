import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ValidatorsService } from '../../../shared/services/validator.service';

@Component({
  templateUrl: './dinamic-page.component.html',
  styles: ``
})
export class DinamicPageComponent {

  // Forma inicial de la logica de un formulario reactivo - inicio
  public myForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    favoriteGames: this.fb.array([
      ['The legend of Zelda', Validators.required],
      ['Elden ring', Validators.required],
    ])
  })

  public newFavorite: FormControl = new FormControl('', Validators.required)


  // inyectar servicios
  constructor(
    private fb: FormBuilder,
    private validatorService: ValidatorsService,
  ) { }

  get favoriteGames() {
    return this.myForm.get('favoriteGames') as FormArray
  }

  // validaciones - inicio
  isValidField(field: string): boolean | null {
    return this.validatorService.isValidField( this.myForm, field )
  }

  isValidFieldInArray(formArray: FormArray, index: number) {
    return formArray.controls[index].errors
      && formArray.controls[index].touched
  }

  getFieldError(field: string): string | null {
    if (!this.myForm.controls[field]) return null

    const errors = this.myForm.controls[field].errors || {}

    for (const key of Object.keys(errors)) {
      switch (key) {
        case 'required':
          return 'Este campo es requerido'

        case 'minlength':
          return `Mínimo ${errors['minlength'].requiredLength} caracteres`
      }
    }

    return null
  }
  // validaciones - fin

  // método agregar elementos - inicio
  onAddToFavorites(): void {
    if ( this.newFavorite.invalid ) return
    const newGame = this.newFavorite.value

    // this.favoriteGames.push( new FormControl( newGame, Validators.required ) )

    this.favoriteGames.push(
      this.fb.control( newGame, Validators.required )
    )

    this.newFavorite.reset()

  }
  // método agregar elementos - fin

  // Método eliminar elementos - inicio
  onDeleteFavorite(index: number): void {
    this.favoriteGames.removeAt(index)
  }
  // Método eliminar elementos - fin

  // Método para botón guardar -inicio
  onSubmit(): void {
    if (this.myForm.invalid) {
      this.myForm.markAllAsTouched()
      return
    }

    console.log(this.myForm.value);
    ( this.myForm.controls['favoriteGames'] as FormArray ) = this.fb.array([])
    this.myForm.reset()
  }
  // Método para botón guardar -fin

  // Forma inicial de la logica de un formulario reactivo - fin

}
