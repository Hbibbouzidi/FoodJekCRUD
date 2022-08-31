import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BackendService } from '../_services'
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';

import { Livreur } from './livreur';

@Injectable()
export class LivreurService {
  private basicAction = 'livreur/';

  constructor(private http: HttpClient, private backend: BackendService) { }

  getLivreurs(): Observable<Livreur[]> {
    return this.http.get<Livreur[]>('http://192.168.43.247:8080/livreur');
  }

  getLivreur(id: number): Observable<Livreur> {
    return this.http.get<Livreur>(`http://192.168.43.247:8080/livreur/${id}`);
  }

  deleteLivreur(id: number): Observable<Response> {

    const action = `${this.basicAction}${id}`;
    return this.http.delete<Response>(`http://192.168.43.247:8080/livreur/${id}`).catch(this.handleError);
  }

  saveLivreur(livreur: Livreur): Observable<Livreur> {


    if (livreur.id === 0) {
      return this.createLivreur(livreur);
    }
    return this.updateLivreur(livreur);
  }

  private createLivreur(r: Livreur): Observable<Livreur> {
    r.id = undefined;
    return this.http.post<Livreur>('http://192.168.43.247:8080/livreur', r)
      .catch(this.handleError);
  }

  private updateLivreur(r: Livreur): Observable<Livreur> {
    return this.http.put<Livreur>('http://192.168.43.247:8080/Livreur', r)
      .catch(this.handleError);
  }

  private extractData(response: Response) {
    let body : any = response.json ? response.json() : response;
    return body.data ? body.data : (body || {});
  }

  private handleError(error: Response): Observable<any> {
    // in a real world app, we may send the server to some remote logging infrastructure
    // instead of just logging it to the console
    console.error(error);
    return Observable.throw(error.json() || 'Server error');
  }

  initializeLivreur(): Livreur {
    // Return an initialized object
    return {
      id: 0,
      cin: 0,
      firstname: null,
      lastname: null,
      address: null,
      tel: null,
      latitude: 0,
      longitude: 0,
    };
  }
}
