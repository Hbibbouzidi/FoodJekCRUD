import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BackendService } from '../_services'
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';

import { Plat } from './plat';
import { Restaurant } from '../plat';

@Injectable()
export class PlatService {
  private basicAction = 'plat/';

  constructor(private http: HttpClient, private backend: BackendService) { }

  getPlats(): Observable<Plat[]> {
    return this.http.get<Plat[]>('http://192.168.43.247:8080/plat');
  }

  getPlat(id: number): Observable<Plat> {
    return this.http.get<Plat>(`http://192.168.43.247:8080/plat/${id}`);
  }

  deletePlat(id: number): Observable<Response> {

    const action = `${this.basicAction}${id}`;
    return this.http.delete<Response>(`http://192.168.43.247:8080/plat/${id}`).catch(this.handleError);
  }
  
  getRestaurants(): Observable<Restaurant[]> {
    return this.http.get<Restaurant[]>('http://192.168.43.247:8080/Restaurant');
  }

  savePlat(plat: Plat): Observable<Plat> {


    if (plat.id === 0) {
      return this.createPlat(plat);
    }
    return this.updatePlat(plat);
  }

  private createPlat(r: Plat): Observable<Plat> {
    r.id = undefined;
    return this.http.post<Plat>('http://192.168.43.247:8080/plat', r)
      .catch(this.handleError);
  }

  private updatePlat(r: Plat): Observable<Plat> {
    return this.http.put<Plat>('http://192.168.43.247:8080/plat', r)
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

  initializePlat(): Plat {
    // Return an initialized object
    return {
      id: 0,
      name: null,
      description: null,
      price: 0,
      image: null,
      restaurant: 0,
    };
  }
}
