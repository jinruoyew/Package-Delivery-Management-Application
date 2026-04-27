import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatabaseService } from '../../services/database.service';
import { Router } from '@angular/router';
import { Driver } from '../../models/driver';
import { UpperCasePipe } from  '../../pipes/upper-case.pipe';

@Component({
  selector: 'app-delete-driver',
  standalone: true,
  imports: [FormsModule, UpperCasePipe],
  templateUrl: './delete-driver.component.html',
  styleUrl: './delete-driver.component.css'
})
export class DeleteDriverComponent {

  driverId: string = '';
  driversDb: Driver[] = [];

  constructor(private db: DatabaseService, private router: Router) { }

  ngOnInit() {
    this.db.getDrivers().subscribe((data:any)=>{
      this.driversDb = data;
    });
  }

  // Function to delete a driver
  deleteDriver(id: string) {

    // Use database service to delete a driver
    this.db.deleteDriver(id).subscribe({
      next: (result: any) => {
        // If the driver is successfully deleted, navigate to the list-drivers page
        this.router.navigate(['list-drivers']); 
      },
      error: (error: any) => {
        // If there is an error, navigate to the invalid-data page
        this.router.navigate(['invalid-data']);
      }
  });
  }

}
