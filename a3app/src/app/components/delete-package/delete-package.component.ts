import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatabaseService } from '../../services/database.service';
import { Router } from '@angular/router';
import { Package } from '../../models/package';
import { ConvertWeightPipe } from '../../pipes/convert-weight.pipe';

@Component({
  selector: 'app-delete-package',
  standalone: true,
  imports: [FormsModule, ConvertWeightPipe],
  templateUrl: './delete-package.component.html',
  styleUrl: './delete-package.component.css'
})
export class DeletePackageComponent {
  
  // Initialize packagesDb as an empty array
  packagesDb: Package[] = [];

  constructor(private db: DatabaseService, private router:Router) { }

  ngOnInit(){
    // Get all packages from the database on initialization
    this.db.getPackages().subscribe((data:any)=>{
      this.packagesDb = data;
    });

  }
  
  // Function to delete a package
  deletePackage(id: string){

    // Use database service to delete a package
    this.db.deletePackage(id).subscribe(
      {
        next: (data: any) => {
          // If the package is successfully deleted, navigate to the list-packages page
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
