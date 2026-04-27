import { Component } from '@angular/core';
import { DatabaseService } from '../../services/database.service';
import { Driver } from '../../models/driver';
import { io } from 'socket.io-client';
import { ChangeDetectorRef } from '@angular/core';
import { OnInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-text-to-speech',
  standalone: true,
  imports: [],
  templateUrl: './text-to-speech.component.html',
  styleUrl: './text-to-speech.component.css'
})
export class TextToSpeechComponent {

  // Declare variables
  driversDb: Driver[] = [];
  socket: any;
  audioFilePath: string = '';
  showPlayer: boolean = false;
  loads: number = 0;


  // Declare audio player reference
  @ViewChild('audioPlayer', { static: false }) audioPlayerRef!: ElementRef<HTMLAudioElement>;

  constructor(private db: DatabaseService, private cdr: ChangeDetectorRef) { 
    // Create a new socket.io client
    this.socket = io();

    // Listen to events
    this.listen2Events();
  }

  ngOnInit() {
    // Get drivers from the database on initialization
    this.getDrivers();
  }

  // Function to listen to events from the server
  listen2Events() {
    // Listen to the event 'text2SpeechComplete' from the server
    this.socket.on(
      'text2SpeechComplete', 
      (data: any) => {
        // Get the audio file path from the server
        this.audioFilePath = data.path;
        
        // Increment the loads variable
        this.loads += 1;
        
        // Show the audio player
        this.showPlayer = true;

        // Trigger manual change detection
        this.cdr.detectChanges();

        // Reload the audio player
        if (this.loads > 1){
          this.reloadAudio();
        }
        
      }
    )
  }

  // Function to get all drivers from the database using db service
  getDrivers() {
    this.db.getDrivers().subscribe((data:any)=>{
      this.driversDb = data;
    });
  }

  // Function to convert driver's licence to speech
  convertLicence2Speech(driver_licence: string) {
    // Generate a unique id
    const uniqueId = new Date().getTime().toLocaleString();
    // Emit the event 'text2Speech'
    this.socket.emit('text2Speech', {id: uniqueId, text: driver_licence}); //client emits event to server
  }

  // Function to reload the audio player
  reloadAudio() {
    // Check if the audio player reference is available
    if (this.audioPlayerRef) {
      // Reload the audio player
      this.audioPlayerRef.nativeElement.load();
      console.log('Audio reloaded successfully');
    } else {
      console.error('Audio player reference is not available');
    }
  }

}
