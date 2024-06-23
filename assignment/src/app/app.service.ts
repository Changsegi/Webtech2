import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Felhasznalo } from './model/user';
import { Termek } from './model/item';

@Injectable({
  providedIn: 'root'
})

export class AppService {

  serviceURL = 'http://localhost:8080';
  headers = new HttpHeaders().set('Content-Type', 'application/json');
  user = new Felhasznalo();

  constructor(private http: HttpClient) { }

  createUser(data): Observable<any> {
    const url = `${this.serviceURL}/addUser`;
    return this.http.post(url, data)
      .pipe(
        catchError(this.errorMgmt)
      );
  }

  getUsers() {
    return this.http.get(`${this.serviceURL}/getallUser`);
  }

  getUser(id): Observable<any> {
    const url = `${this.serviceURL}/getUser/${id}`;
    return this.http.get(url, { headers: this.headers }).pipe(
      map((res: Response) => {
        return res || {};
      }),
      catchError(this.errorMgmt)
    );
  }

  createItem(data): Observable<any> {
    const url = `${this.serviceURL}/addItem`;
    return this.http.post(url, data)
      .pipe(
        catchError(this.errorMgmt)
      );
  }

  getItemById(id): Observable<any> {
    const url = `${this.serviceURL}/getItem/${id}`;
    return this.http.get(url, { headers: this.headers }).pipe(
      map((res: Response) => {
        return res || {};
      }),
      catchError(this.errorMgmt)
    );
  }

  checkItemName(name: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.serviceURL}/exists?name=${name}`);
  }

 

  getItem() {
    return this.http.get(`${this.serviceURL}/getItem`);
  }

  setLoggedInUser(user){
    this.user = user;
  }

  getLoggedInUser(){
    return this.user;
  }

  errorMgmt(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    alert(errorMessage);
    return throwError(errorMessage);
  }
}
