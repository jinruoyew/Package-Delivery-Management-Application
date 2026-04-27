import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatabaseService } from '../../services/database.service';
import { Router } from '@angular/router';
import { Package } from '../../models/package';
import { Driver } from '../../models/driver';

@Component({
  selector: 'app-add-package',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './add-package.component.html',
  styleUrl: './add-package.component.css'
})
export class AddPackageComponent {

  // Create a new package object to store the form data
  package: Package = new Package();

  // Create an array to store all drivers from the database
  driversDb: Driver[] = [];

  constructor(private db: DatabaseService, private router:Router) { }

  ngOnInit(){

    // Get all drivers from the database on initialization
    this.db.getDrivers().subscribe((data:any)=>{
      this.driversDb = data;
    });
    
  }

  // Function to add a package to the database
  addPackage() {
    
    // Use database service to create a package
    this.db.createPackage(this.package).subscribe(
      {
        next: (data: any) => {
          // If the package is successfully added, navigate to the list-packages page
          this.router.navigate(['list-packages']); 
        },
        error: (error: any) => {
          // If there is an error, navigate to the invalid-data page
          this.router.navigate(['invalid-data']);
        }
      }
    )

  }

}
