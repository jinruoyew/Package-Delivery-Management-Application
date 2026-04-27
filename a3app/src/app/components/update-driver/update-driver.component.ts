import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatabaseService } from '../../services/database.service';
import { Router } from '@angular/router';
import { Driver } from '../../models/driver';

@Component({
  selector: 'app-update-driver',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './update-driver.component.html',
  styleUrl: './update-driver.component.css'
})
export class UpdateDriverComponent {
  
  // Create a new driver object to store the updated driver
  driver: Driver = new Driver();

  constructor(private db: DatabaseService, private router:Router) { }

  // Function to update a driver in the database
  updateDriver() {

    // Use database service to update a driver
    this.db.updateDriver(this.driver).subscribe(
      {
        next: (data: any) => {
          // If the driver is successfully updated, navigate to the list-drivers page
          this.router.navigate(['list-drivers']); 
        },
        error: (error: any) => {
          // If there is an error, navigate to the invalid-data page
          this.router.navigate(['invalid-data']);
        }
      }
    )

  }

}
