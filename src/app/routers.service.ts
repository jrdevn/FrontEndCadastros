import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject } from 'rxjs';
import { UsuarioService } from './api/usuario.service';
import { Usuario } from './models/usuario';
import { DialogExcluirComponent } from './shared/dialog-excluir/dialog-excluir.component';

@Injectable({
  providedIn: 'root'
})
export class RoutersService {

  constructor(private usuarioService: UsuarioService,
              private dialog: MatDialog) { }



   public validaExclusao = new BehaviorSubject<boolean>(false);

   async excluirUsuarioDialog(usuario: Usuario): Promise<void> {
    const dialogRef = this.dialog.open(DialogExcluirComponent, {
      width: '250px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.excluirUsuario(usuario.UsuarioId);
      }
    });
  }

  async excluirUsuario(usuarioId: number): Promise<void> {
    this.usuarioService.excluirUsuario(usuarioId).subscribe((response: any) => {
      if (response) {
        this.validaExclusao.next(true);
      }
    }, error => {
      console.log(error);
      return false;
    });
  }
}
