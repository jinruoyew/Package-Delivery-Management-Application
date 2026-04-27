import { Component } from '@angular/core';
import { DatabaseService } from '../../services/database.service';

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [],
  templateUrl: './statistics.component.html',
  styleUrl: './statistics.component.css'
})
export class StatisticsComponent {

  // Initialize the CRUD count variable values
  creates = 0;
  reads = 0;
  updates = 0;
  deletes = 0;

  constructor(private db: DatabaseService) { }

  ngOnInit(){

    // Get the CRUD count on initialization from the database
    this.db.getCRUDCount().subscribe((data: any) => {
      try{
        // Set the CRUD count values
        this.creates = data.creates;
        this.reads = data.reads;
        this.updates = data.updates;
        this.deletes = data.deletes;
      } catch (error) {
        console.log(error);
      }
    });
  }

}
