import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DatabaseService } from '../../services/database.service';
import { Driver } from '../../models/driver';
import { UpperCasePipe } from  '../../pipes/upper-case.pipe';
import { Package } from '../../models/package';

@Component({
  selector: 'app-list-drivers',
  standalone: true,
  imports: [UpperCasePipe],
  templateUrl: './list-drivers.component.html',
  styleUrl: './list-drivers.component.css'
})
export class ListDriversComponent {

  // Array to store all drivers
  driversDb: Driver[] = [];

  // Array to store all packages assigned to a driver
  assignedPackagesDb: Package[] = [];

  // Id of the currently selected driver
  selectedDriverId: string = ''; 

  constructor(private db:DatabaseService, private router:Router) { }

  ngOnInit(){
    // Get all drivers from the database
    this.getDrivers();
  }

  // Function to show the details of packages assigned to a driver
  showPackageDetails(id: string){

    // Set the selected driver id
    this.selectedDriverId = id;

    // Use database service to get all packages assigned to a driver
    this.db.getAssignedPackages(this.selectedDriverId).subscribe(
      {
        next: (data:any)=>{
          // If the data is successfully retrieved, store it in assignedPackagesDb
          this.assignedPackagesDb = data;
        },
        error: (error:any)=>{
          // If there is an error, navigate to the invalid-data page
          this.router.navigate(['invalid-data']);
        }
      }
    );
  }
  
  // Function to get all drivers from the database
  getDrivers() {

    // Use database service to get all drivers
    this.db.getDrivers().subscribe((data:any)=>{
      this.driversDb = data;
    });
  }

}
