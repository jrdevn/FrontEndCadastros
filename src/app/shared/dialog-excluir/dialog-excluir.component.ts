import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-excluir',
  templateUrl: './dialog-excluir.component.html',
  styleUrls: ['./dialog-excluir.component.scss']
})
export class DialogExcluirComponent implements OnInit {

  constructor( public dialogRef: MatDialogRef<DialogExcluirComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
  }

  cancelar(): void {
    this.dialogRef.close();
  }

  // tslint:disable-next-line: typedef
  confirmar() {
    this.dialogRef.close(true);
  }

}
