import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { GeneroService } from '../api/genero.service';
import { UsuarioService } from '../api/usuario.service';
import { Sexo } from '../models/sexo';
import { Usuario } from '../models/usuario';

export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY',
  },
};

@Component({
  selector: 'app-formulario-usuarios',
  templateUrl: './formulario-usuarios.component.html',
  styleUrls: ['./formulario-usuarios.component.scss'],
  providers: [
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ]
})
export class FormularioUsuariosComponent implements OnInit {

  usuario: Usuario;
  sexos: Sexo[];
  constructor(private formBuilder: FormBuilder,
              private generoService: GeneroService,
              private usuarioService: UsuarioService,
              private router: Router) {
    this.usuario = new Usuario();
  }

  maxDate: any;

  usuarioForm: FormGroup;

  ngOnInit(): void {
    this.maxDate = moment().subtract(5, 'years');
    console.log(this.maxDate);
    this.carregaGeneros();
    this.createForm();
  }

  createForm(): void {
    this.usuarioForm = this.formBuilder.group({
      Nome: ['', [Validators.required, Validators.minLength(3)]],
      Email: ['', [Validators.required, Validators.email]],
      DataNascimento: ['', [Validators.required, Validators.required]],
      SexoId: ['', [Validators.required, Validators.required]],
      Senha: ['', [Validators.required, Validators.required]],
    });
  }


  async carregaGeneros(): Promise<void> {
    this.generoService.getAll().subscribe((response: HttpResponse<Sexo[]>) => {
      if (response) {
        this.sexos = response.body;
      }
    }, error => {
      console.log(error);
    });
  }

  salvarUsuario(): void {
    if (this.usuarioForm.valid) {
      const usuarioResponse = this.usuarioForm.value;
      usuarioResponse.SexoId = Number(usuarioResponse.SexoId);
      this.usuarioService.cadastrarUsuario(usuarioResponse).subscribe((response: any) => {
        if (response) {
          this.router.navigateByUrl('/relatorio-usuarios');
        }
      }, error => {
        console.log(error);
      });
    }
  }
}
