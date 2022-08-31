import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BackendService } from '../_services'
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';

import { Restaurant } from './restaurant';

@Injectable()
export class RestaurantService {
  private basicAction = 'Restaurant/';

  constructor(private http: HttpClient, private backend: BackendService) { }

  getRestaurants(): Observable<Restaurant[]> {
    return this.http.get<Restaurant[]>('http://192.168.43.247:8080/Restaurant');
  }

  getRestaurant(id: number): Observable<Restaurant> {
    return this.http.get<Restaurant>(`http://192.168.43.247:8080/Restaurant/${id}`);
  }

  deleteRestaurant(id: number): Observable<Response> {

    const action = `${this.basicAction}${id}`;
    return this.http.delete<Response>(`http://192.168.43.247:8080/Restaurant/${id}`).catch(this.handleError);
  }

  saveRestaurant(restaurant: Restaurant): Observable<Restaurant> {


    if (restaurant.id === 0) {
      return this.createRestaurant(restaurant);
    }
    return this.updateRestaurant(restaurant);
  }

  private createRestaurant(r: Restaurant): Observable<Restaurant> {
    r.id = undefined;
    return this.http.post<Restaurant>('http://192.168.43.247:8080/Restaurant', r)
      .catch(this.handleError);
  }

  private updateRestaurant(r: Restaurant): Observable<Restaurant> {
    return this.http.put<Restaurant>('http://192.168.43.247:8080/Restaurant', r)
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

  initializeRestaurant(): Restaurant {
    // Return an initialized object
    return {
      id: 0,
      name: null,
      address: null,
      tel: null,
      email: null,
    };
  }
}
