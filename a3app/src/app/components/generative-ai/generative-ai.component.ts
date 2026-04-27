import { Component } from '@angular/core';
import { io } from 'socket.io-client';
import { DatabaseService } from '../../services/database.service';
import { Package } from '../../models/package';
import { Router } from '@angular/router';

@Component({
  selector: 'app-generative-ai',
  standalone: true,
  imports: [],
  templateUrl: './generative-ai.component.html',
  styleUrl: './generative-ai.component.css'
})
export class GenerativeAiComponent {

  // Socket connection variable
  socket: any;

  // Variable to store the packages from the database
  packagesDb: Package[] = [];

  // Variable to store the result from the server
  result: string = '';

  constructor(private db: DatabaseService, private router: Router) { 
    // Create a socket connection
    this.socket = io();

    // Listen to events from the server
    this.listen2Events();
  }

  ngOnInit() {
    // Get the packages from the database
    this.getPackages();
  }

  // Function to get all packages from the database using db service
  getPackages() {
    this.db.getPackages().subscribe((data:any)=>{
      this.packagesDb = data;
    });
  }

  // Function to listen to events from the server
  listen2Events() {

    // Listen to the event 'distanceCalculated' from the server
    this.socket.on('distanceCalculated', (data: any) => {
      try{
        // Get the result from the server
        this.result = data.result.response.candidates[0].content.parts[0].text;
      } catch (error) {
        // If there is an error, navigate to the invalid-data page
        this.router.navigate(['invalid-data']);
      }
      
    });
    
  }

  calculateDistance(destination: string) {
    this.socket.emit('distanceCalculation', {destination: destination});
  }
}
