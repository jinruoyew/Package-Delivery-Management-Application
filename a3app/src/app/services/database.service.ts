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
const API_URL = 'http://'+ VM_EXTERNAL_IP + ':8080/33343276/JinRuo/api/v1';
// change to use the external IP address instead of localhost for VM deployment

/**
 * The HTTP options
 * @const
 */
const httpOptions = {
  headers: new HttpHeaders({ "Content-Type": "application/json" }),
};

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  constructor(private http: HttpClient) { }

  // Function to create a driver using the backend API endpoint
  createDriver(driver: any) {
    return this.http.post(API_URL + '/drivers/add', driver, httpOptions);
  }

  // Function to get all drivers using the backend API endpoint
  getDrivers() {
    return this.http.get(API_URL + '/drivers');
  }

  // Function to delete a driver using the backend API endpoint
  deleteDriver(id: string) {
    return this.http.delete(API_URL + '/drivers/delete', { params: { driver_id: id } });
  }

  // Function to update a driver using the backend API endpoint
  updateDriver(driver: any) {
    return this.http.put(API_URL + '/drivers/update', driver, httpOptions);
  }

  // Function to create a new package using the backend API endpoint
  createPackage(iPackage: any) {
    return this.http.post(API_URL + '/packages/add', iPackage, httpOptions);
  }

  // Function to get all packages using the backend API endpoint
  getPackages() {
    return this.http.get(API_URL + '/packages');
  }

  // Function to delete a package using the backend API endpoint
  deletePackage(id: string) {
    return this.http.delete(API_URL + '/packages/delete/' + id);
  }

  // Function to update a package using the backend API endpoint
  updatePackage(iPackage: any) {
    return this.http.put(API_URL + '/packages/update', iPackage, httpOptions);
  }

  // Function to get the CRUD count using the backend API endpoint
  getCRUDCount() {
    return this.http.get(API_URL + '/stats');
  }

  // Function to get all packages assigned to a driver using the backend API endpoint
  getAssignedPackages(id: string) {
    return this.http.get(API_URL + '/drivers/assignedPackages/' + id);
  }

}
