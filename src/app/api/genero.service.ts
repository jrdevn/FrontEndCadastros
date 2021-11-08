import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Sexo } from '../models/sexo';

@Injectable({
  providedIn: 'root'
})
export class GeneroService {

  constructor(private httpClient: HttpClient) { }

  apiUrl = environment.ApiUrl + '/sexos';

  public getAll(): Observable<HttpResponse<Sexo[]>> {
    return this.httpClient.get<Sexo[]>(`${this.apiUrl}`, {observe: 'response'});
  }
}
