import { Component } from '@angular/core';
import { io } from 'socket.io-client';
import { DatabaseService } from '../../services/database.service';
import { Package } from '../../models/package';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ConvertLanguagePipe } from '../../pipes/convert-language.pipe';

@Component({
  selector: 'app-translate-description',
  standalone: true,
  imports: [FormsModule, ConvertLanguagePipe],
  templateUrl: './translate-description.component.html',
  styleUrl: './translate-description.component.css'
})
export class TranslateDescriptionComponent {

  // Declare variables
  packagesDb: Package[] = [];
  description: string = '';
  targetLanguage: string = '';
  translations: any[] = [];
  socket: any;

  constructor(private db: DatabaseService, private router: Router) {
    // Initialize the socket connection 
    this.socket = io();

    // Listen to events from the server
    this.listen2Events();

  }

  ngOnInit() {
    // Get all packages from the database on initialization
    this.db.getPackages().subscribe((data:any)=>{
      this.packagesDb = data;
    });
    
  }

  //Function to listen to events from the server
  listen2Events() {
    //listen to the event 'translatedDescription' from the server
    this.socket.on(
      'translatedDescription', 
      (data: any) => {
        // Get the result from the server and push it to the translations array
        this.translations.push(data);
      }
    )

    //listen to the event 'translationError' from the server
    this.socket.on(
      'translationError', 
      () => {
        // If there is an error, navigate to the invalid-data page
        this.router.navigate(['invalid-data']);
      }
    )
  }

  //Function to emit event to translate the description
  translateDesc(description: string) {
    this.socket.emit('translateDescription', {targetLanguage: this.targetLanguage, text: description}); //client emits event to server
  }
}
