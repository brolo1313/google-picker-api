import { Injectable } from '@angular/core';

declare var gapi: any;

@Injectable({
  providedIn: 'root'
})
export class GoogleDriveService {

  private CLIENT_ID = '<CLIENT_ID>'; // Replace with your Client ID
  private API_KEY = '<API_KEY>'; // Replace with your API Key
  private SCOPES = 'https://www.googleapis.com/auth/drive.readonly'; // Scope for reading files

  private authInstance: any;

  constructor() { }

  // ngOnInit() {
  //   this.loadGoogleAPI();
  // }

  // loadGoogleAPI() {
  //   const script = document.createElement('script');
  //   script.src = 'https://apis.google.com/js/api.js';
  //   script.async = true;
  //   script.defer = true;
  //   script.onload = () => this.loadClient();
  //   document.body.appendChild(script);
  // }

  // Load Google API client
  loadClient() {
    console.log('gapi', gapi);
    gapi.load('client:auth2', () => {
      this.initClient();
    });
  }

  // Initialize the Google API client
  initClient() {
    gapi.client.init({
      apiKey: this.API_KEY,
      clientId: this.CLIENT_ID,
      scope: this.SCOPES,
      discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"],
    }).then(() => {
      this.authInstance = gapi.auth2.getAuthInstance();
      console.log('Client initialized',   this.authInstance);
    });
  }

  // Sign in to Google
  signIn() {
    this.authInstance.signIn().then(() => {
      console.log('User signed in');
    });
  }

  // Sign out of Google
  signOut() {
    this.authInstance.signOut().then(() => {
      console.log('User signed out');
    });
  }

  // Download file from Google Drive by file ID
  downloadFile(fileId: string) {
    gapi.client.drive.files.get({
      fileId: fileId,
      alt: 'media'
    }).then((response: any) => {
      const fileData = response.body;
      this.saveFile(fileData);
    }).catch((error: any) => {
      console.error('Error downloading file', error);
    });
  }

  // Save file (e.g., for downloading as Blob)
  saveFile(fileData: any) {
    const blob = new Blob([fileData], { type: 'application/octet-stream' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = 'file_name.extension'; // You can dynamically set the file name
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
  }
}
