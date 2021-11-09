import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Route, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { GeneroService } from '../api/genero.service';
import { UsuarioService } from '../api/usuario.service';
import { Exclusao } from '../interfaces/exclusao';
import { Notificacao } from '../interfaces/notificacao';
import { Sexo } from '../models/sexo';
import { Usuario } from '../models/usuario';
import { RoutersService } from '../routers.service';
import { DialogExcluirComponent } from '../shared/dialog-excluir/dialog-excluir.component';

@Component({
  selector: 'app-relatorio-usuarios',
  templateUrl: './relatorio-usuarios.component.html',
  styleUrls: ['./relatorio-usuarios.component.scss']
})
export class RelatorioUsuariosComponent implements OnInit, Exclusao, Notificacao {

  usuarios: Usuario[];
  sexos: Sexo[];
  pesquisa: string;
  ativos = true;
  carregou = false;
  constructor(private usuarioService: UsuarioService,
              private generoService: GeneroService,
              private router: Router,
              public dialog: MatDialog,
              private routersService: RoutersService,
              private toastr: ToastrService,
              private spinner: NgxSpinnerService
  ) { }


  ngOnInit(): void {
    this.carregaUsuarios(this.ativos);
  }

  async carregaUsuarios(ativos: boolean): Promise<void> {
    this.spinner.show();
    this.usuarioService.getAll(ativos).subscribe((response: HttpResponse<Usuario[]>) => {
      if (response) {
        this.usuarios = response.body;
        setTimeout(() => {
          this.spinner.hide();
        }, 500);
        this.carregaGeneros();
      }
    }, error => {
      this.spinner.hide();
      console.log(error);
    });
  }

  async carregaUsuariosPorNome(nome: string): Promise<void> {
    if (nome != null && nome !== '') {
      this.spinner.show();
      this.usuarioService.getByDescricao(this.ativos, nome).subscribe((response: HttpResponse<Usuario[]>) => {
        if (response) {
          this.usuarios = response.body;
          setTimeout(() => {
            this.spinner.hide();
          }, 300);
          this.carregaGeneros();
        }
      }, error => {
        console.log(error);
      });
    } else {
      this.carregaUsuarios(this.ativos);
    }

  }

  async carregaGeneros(): Promise<void> {
    this.generoService.getAll().subscribe((response: HttpResponse<Sexo[]>) => {
      if (response) {
        this.sexos = response.body;
        this.usuarios.map(x => x.SexoDescricao = this.sexos.find(s => s.SexoId === x.SexoId).Descricao);
      }
    }, error => {
      console.log(error);
    });
  }

  editar(usuario: Usuario): void {
    this.router.navigate(['/editar-usuarios', { usuarioId: usuario.UsuarioId }]);
  }

  exibirInativos(validador: boolean): void {
    this.ativos = !validador;
    this.carregaUsuarios(this.ativos);
  }

  excluirUsuario(usuario: Usuario): void {
    this.routersService.excluirUsuarioDialog(usuario);
    this.routersService.validaExclusao.subscribe(result => {
      if (result === true) {
        this.routersService.validaExclusao.next(false);
        this.notificacao('Usuario excluido', 'Atenção!');
        this.carregaUsuarios(this.ativos);
      }
    });
  }

  validaPesquisa(pesquisa: string): void {
    if (pesquisa === null || pesquisa === '') {
      this.carregaUsuarios(this.ativos);
    }
  }

  async notificacao(message: string, title: string): Promise<void> {
    const toaster = this.toastr.warning(message, title, {
      timeOut: 3000,
      closeButton: true,
    });
    this.toastr.clear();
  }

  cadastraUsuario(): void {
    this.router.navigateByUrl('/formulario-usuarios');
  }

}
