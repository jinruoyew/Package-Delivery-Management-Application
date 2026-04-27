import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

/**
 * The external IP address of the VM instance
 * @const
 */
const VM_EXTERNAL_IP = '34.129.149.209';

/**
 * The API URL
 * @const
 */
const API_URL = 'http://'+ VM_EXTERNAL_IP + ':8080/33343276/JinRuo/api/v1/users';
// change to use the external IP address instead of localhost for VM deployment

const httpOptions = {
  headers: new HttpHeaders({ "Content-Type": "application/json" }),
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  // Function to check if the user is authenticated
  isUserAuthenticated() {
    return this.http.get(API_URL + '/auth', httpOptions);

  }

  // Function to login using the backend API endpoint
  login(user: any) {
    return this.http.post(API_URL + '/login', user, httpOptions);
  }

  // Function to signup using the backend API endpoint
  signup(user: any) {
    return this.http.post(API_URL + '/signup', user, httpOptions);
  }
}
