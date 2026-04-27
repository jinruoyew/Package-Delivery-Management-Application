import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UpdatePackage } from '../../models/updatePackage';
import { DatabaseService } from '../../services/database.service';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-update-package',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './update-package.component.html',
  styleUrl: './update-package.component.css'
})
export class UpdatePackageComponent {

  // Create a new package object to store the updated package
  package: UpdatePackage = new UpdatePackage();

  constructor(private db: DatabaseService, private router:Router) { }

  // Function to update a package in the database
  updatePackage() {
    // Use database service to update a package
    this.db.updatePackage(this.package).subscribe(
      {
        next: (data: any) => {
          // If the package is successfully updated, navigate to the list-packages page
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
