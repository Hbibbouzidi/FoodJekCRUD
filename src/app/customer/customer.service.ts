import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BackendService } from '../_services'
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';

import { Customer } from './customer';

@Injectable()
export class CustomerService {
  private basicAction = 'customer/';

  constructor(private http: HttpClient, private backend: BackendService) { }

  getCustomers(): Observable<Customer[]> {
    return this.http.get<Customer[]>('http://192.168.43.247:8080/customer');
  }

  getCustomer(id: number): Observable<Customer> {
    return this.http.get<Customer>(`http://192.168.43.247:8080/customer/${id}`);
  }

  deleteCustomer(id: number): Observable<Response> {

    const action = `${this.basicAction}${id}`;
    return this.http.delete<Response>(`http://192.168.43.247:8080/customer/${id}`).catch(this.handleError);
  }

  saveCustomer(customer: Customer): Observable<Customer> {


    if (customer.id === 0) {
      return this.createCustomer(customer);
    }
    return this.updateCustomer(customer);
  }

  private createCustomer(r: Customer): Observable<Customer> {
    r.id = undefined;
    return this.http.post<Customer>('http://192.168.43.247:8080/customer', r)
      .catch(this.handleError);
  }

  private updateCustomer(r: Customer): Observable<Customer> {
    return this.http.put<Customer>('http://192.168.43.247:8080/customer', r)
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

  initializeCustomer(): Customer {
    // Return an initialized object
    return {
      id: 0,
      firstname: null,
      lastname: null,
      address: null,
      tel: null,
      latitude: 0,
      longitude: 0,
    };
  }
}
