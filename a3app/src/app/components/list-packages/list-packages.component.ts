import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DatabaseService } from '../../services/database.service';
import { Package } from '../../models/package';
import { ConvertWeightPipe } from '../../pipes/convert-weight.pipe';

@Component({
  selector: 'app-list-packages',
  standalone: true,
  imports: [ConvertWeightPipe],
  templateUrl: './list-packages.component.html',
  styleUrl: './list-packages.component.css'
})
export class ListPackagesComponent {

  // Initialize selectedDriver as an empty object
  selectedDriver: any = {};

  // Initialize packagesDb as an empty array
  packagesDb: Package[] = [];

  constructor(private db:DatabaseService) { }

  ngOnInit(){
    // Get all packages from the database on initialization
    this.db.getPackages().subscribe((data:any)=>{
      this.packagesDb = data;
    });

  }

  // Function to show driver details when a package is clicked
  showDriverDetails(iPackage: Package){
    this.selectedDriver = iPackage.driver_id;
  }

  // Function to check if an object is empty
  isEmptyObject(obj: any): boolean {
    return JSON.stringify(obj) === '{}';
  }
  

}
