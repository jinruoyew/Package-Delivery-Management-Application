import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DatabaseService } from '../../services/database.service';
import { Driver } from '../../models/driver';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-driver',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './add-driver.component.html',
  styleUrl: './add-driver.component.css'
})
export class AddDriverComponent {

  // Create a new driver object
  driver: Driver = new Driver();

  constructor(private db: DatabaseService, private router:Router) { }

  // Function to add a driver to the database
  addDriver() {

    // Use database service to create a driver
    this.db.createDriver(this.driver).subscribe({
      next: (data: any) => {
        // If the driver is successfully added, navigate to the list-drivers page
        this.router.navigate(['list-drivers']); 
      },
      error: (error: any) => {
        // If there is an error, navigate to the invalid-data page
        this.router.navigate(['invalid-data']);
      }
    })

  }
}
