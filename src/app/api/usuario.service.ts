import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Usuario } from '../models/usuario';


@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(private httpClient: HttpClient) { }

  apiUrl = environment.ApiUrl + '/usuarios';

  public getAll(ativos: boolean = true): Observable<HttpResponse<Usuario[]>> {
    return this.httpClient.get<Usuario[]>(`${this.apiUrl}/getAll?ativo=${ativos}`, { observe: 'response' });
  }

  public getById(usuarioId: string): Observable<HttpResponse<Usuario>> {
    return this.httpClient.get<Usuario>(`${this.apiUrl}/getUsuarioById?id=${usuarioId}`, { observe: 'response' });
  }

  public getByDescricao(ativos: boolean = true, nome: string): Observable<HttpResponse<Usuario[]>> {
    return this.httpClient.get<Usuario[]>(`${this.apiUrl}/getComDescricao?nome=${nome}&ativo=${ativos}`, { observe: 'response' });
  }

  // tslint:disable-next-line: typedef
  public excluirUsuario(usuarioId: number) {
    return this.httpClient.delete(`${this.apiUrl}?id=${usuarioId}`, { observe: 'response' });
  }

  // tslint:disable-next-line: typedef
  public editarUsuario(usuario: Usuario) {
    return this.httpClient.put(`${this.apiUrl}`, usuario, { observe: 'response' });
  }

  // tslint:disable-next-line: typedef
  public cadastrarUsuario(usuario: Usuario) {
    return this.httpClient.post(`${this.apiUrl}`, usuario, { observe: 'response' });
  }

}
