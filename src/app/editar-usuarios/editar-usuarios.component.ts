import { HttpResponse } from '@angular/common/http';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { GeneroService } from '../api/genero.service';
import { UsuarioService } from '../api/usuario.service';
import { Exclusao } from '../interfaces/exclusao';
import { Notificacao } from '../interfaces/notificacao';
import { Sexo } from '../models/sexo';
import { Usuario } from '../models/usuario';
import { RoutersService } from '../routers.service';

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
  selector: 'app-editar-usuarios',
  templateUrl: './editar-usuarios.component.html',
  styleUrls: ['./editar-usuarios.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ]
})
export class EditarUsuariosComponent implements OnInit, Exclusao, Notificacao {

  usuario: Usuario;
  usuarioId: string;
  sexos: Sexo[];
  maxDate: any;
  usuarioForm: FormGroup;
  formularioValido = true;
  constructor(private formBuilder: FormBuilder,
              private generoService: GeneroService,
              private route: ActivatedRoute,
              private router: Router,
              private usuarioService: UsuarioService,
              private routersService: RoutersService,
              private toastr: ToastrService) {
  }

  excluirUsuario(usuario: Usuario): void {
    this.routersService.excluirUsuarioDialog(usuario);
    this.routersService.validaExclusao.subscribe(result => {
      if (result === true) {
        console.log(result);
        this.routersService.validaExclusao.next(false);
        this.router.navigateByUrl('/relatorio-usuarios');
      }
    });
  }



  ngOnInit(): void {
    const usuarioId = this.route.snapshot.paramMap.get('usuarioId');
    this.carregaUsuario(usuarioId);
    this.maxDate = moment().subtract(5, 'years');
    this.carregaGeneros();
  }

  createForm(): void {
    this.usuarioForm = this.formBuilder.group({
      Nome: [this.usuario.Nome, [Validators.required, Validators.minLength(3)]],
      Email: [this.usuario.Email, [Validators.required, Validators.email]],
      DataNascimento: [this.usuario.DataNascimento, [Validators.required, Validators.required]],
      SexoId: [this.usuario.SexoId, [Validators.required, Validators.required]],
      Senha: [this.usuario.Senha, [Validators.required, Validators.required]],
      Ativo: [this.usuario.Ativo, [Validators.required, Validators.required]],
    });
  }


  async notificacao(message: string, title: string): Promise<void> {
    const toaster = this.toastr.success(message, title, {
      timeOut: 2000,
      closeButton: true,
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

  async carregaUsuario(usuarioId: string): Promise<void> {
    this.usuarioService.getById(usuarioId).subscribe((response: HttpResponse<Usuario>) => {
      if (response) {
        this.usuario = response.body;
        this.createForm();
      }
    }, error => {
      console.log(error);
    });
  }

    // tslint:disable-next-line: typedef
    get formControls() {
      return this.usuarioForm.controls;
    }
  
  salvarUsuario(): void {
    if (this.usuarioForm.valid) {
      this.formularioValido = true;
      let usuarioResponse = new Usuario();
      usuarioResponse = this.usuarioForm.value;
      usuarioResponse.UsuarioId = this.usuario.UsuarioId;
      this.usuarioService.editarUsuario(usuarioResponse).subscribe((response: any) => {
        if (response) {
          this.notificacao('Usuario editado!', 'Edição');
          this.router.navigateByUrl('/relatorio-usuarios');
        }
      }, error => {
        console.log(error);
      });
    } else {
      this.formularioValido = false;
    }
  }

}
