import { Component } from '@angular/core';
import { GoogleDriveService } from './google.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { GooglePickerComponent } from './components/google-picker/google-picker.component';

@Component({
  selector: 'app-root',
  imports: [ FormsModule, CommonModule, GooglePickerComponent ],
  standalone: true,
  // templateUrl: './app.component.html',
  template: `
   <!-- <div>
  <button (click)="onSignIn()">Sign In to Google</button>
  <button (click)="onSignOut()">Sign Out</button>

  <div>
    <h2>Download File</h2>
    <input #fileIdInput type="text" placeholder="Enter file ID" />
    <button (click)="onDownloadFile(fileIdInput.value)">Download File</button>
  </div>
</div> -->
<app-google-picker></app-google-picker>
  `,
  styleUrl: './app.component.scss'
})
export class AppComponent {
  isSignedIn = false;
  fileId = '';

  // constructor(private googleDriveService: GoogleDriveService) {
 
  // }

  // ngOnInit(): void {
  //   // this.googleDriveService.loadGoogleAPI();  
  //   this.googleDriveService.loadClient();  
  // }

  // // Sign in the user
  // onSignIn() {
  //   this.googleDriveService.signIn();
  // }

  // // Sign out the user
  // onSignOut() {
  //   this.googleDriveService.signOut();
  // }

  // // Download a file (pass the Google Drive file ID)
  // onDownloadFile(fileId: string) {
  //   this.googleDriveService.downloadFile(fileId);
  // }
}


/*
gapi.load(): Loads the Google API client with client and auth2 libraries.
gapi.client.init(): Initializes the Google API client with API key, OAuth client ID, and scope.
signIn(): Starts the OAuth2 authentication flow for signing the user in.
signOut(): Signs the user out.
downloadFile(): Downloads a file from Google Drive using the file's ID.
saveFile(): Saves the file on the user's computer as a Blob.
*/