import { Component, OnInit } from '@angular/core';

declare const gapi: any;
declare const google: any;

@Component({
  selector: 'app-google-picker',
  templateUrl: './google-picker.component.html',
  standalone: true,
})
export class GooglePickerComponent implements OnInit {
  // Authorization scopes required by the API
  private readonly SCOPES = 'https://www.googleapis.com/auth/drive.metadata.readonly';

  // Replace with your own client ID, API key, and app ID
  private readonly CLIENT_ID = '<CLIENT_ID>';
  private readonly API_KEY = '<API_KEY>';
  private readonly APP_ID = '<YOUR_APP_ID>';

  private tokenClient: any;
  private accessToken: string | null = null;
  private pickerInited = false;
  private gisInited = false;

  ngOnInit(): void {
    this.loadGapi();
    this.loadGis();
  }

  /**
   * Load the Google API client library.
   */
  private loadGapi(): void {
    gapi.load('client:picker', () => {
      gapi.client.init({}).then(() => {
        gapi.client.load('https://www.googleapis.com/discovery/v1/apis/drive/v3/rest');
        this.pickerInited = true;
        this.maybeEnableButtons();
      });
    });
  }

  /**
   * Load the Google Identity Services library.
   */
  private loadGis(): void {
    this.tokenClient = google.accounts.oauth2.initTokenClient({
      client_id: this.CLIENT_ID,
      scope: this.SCOPES,
      callback: '', // Defined later
    });
    this.gisInited = true;
    this.maybeEnableButtons();
  }

  /**
   * Enable buttons once both libraries are loaded.
   */
  private maybeEnableButtons(): void {
    if (this.pickerInited && this.gisInited) {
      const authorizeButton = document.getElementById('authorize_button');
      if (authorizeButton) {
        authorizeButton.style.visibility = 'visible';
      }
    }
  }

  /**
   * Handle the "Authorize" button click.
   */
  public handleAuthClick(): void {
    this.tokenClient.callback = async (response: any) => {
      if (response.error !== undefined) {
        throw response;
      }
      this.accessToken = response.access_token;
      const signoutButton = document.getElementById('signout_button');
      const authorizeButton = document.getElementById('authorize_button');
      if (signoutButton && authorizeButton) {
        signoutButton.style.visibility = 'visible';
        authorizeButton.innerText = 'Refresh';
      }
      await this.createPicker();
    };

    if (this.accessToken === null) {
      // Prompt the user to select a Google Account and ask for consent
      this.tokenClient.requestAccessToken({ prompt: 'consent' });
    } else {
      // Skip account chooser and consent dialog for an existing session
      this.tokenClient.requestAccessToken({ prompt: '' });
    }
  }

  /**
   * Handle the "Sign Out" button click.
   */
  public handleSignoutClick(): void {
    if (this.accessToken) {
      google.accounts.oauth2.revoke(this.accessToken);
      this.accessToken = null;
      const contentElement = document.getElementById('content');
      const authorizeButton = document.getElementById('authorize_button');
      const signoutButton = document.getElementById('signout_button');
      if (contentElement && authorizeButton && signoutButton) {
        contentElement.innerText = '';
        authorizeButton.innerText = 'Authorize';
        signoutButton.style.visibility = 'hidden';
      }
    }
  }

  /**
   * Create and render a Picker object for searching images.
   */
  private createPicker(): void {
    const view = new google.picker.View(google.picker.ViewId.DOCS);
    view.setMimeTypes('image/png,image/jpeg,image/jpg');
    const picker = new google.picker.PickerBuilder()
      .enableFeature(google.picker.Feature.NAV_HIDDEN)
      .enableFeature(google.picker.Feature.MULTISELECT_ENABLED)
      .setDeveloperKey(this.API_KEY)
      .setAppId(this.APP_ID)
      .setOAuthToken(this.accessToken)
      .addView(view)
      .addView(new google.picker.DocsUploadView())
      .setCallback(this.pickerCallback)
      .build();
    picker.setVisible(true);
  }

  /**
   * Handle the Picker callback.
   */
  private pickerCallback(data: any): void {
    if (data.action === google.picker.Action.PICKED) {
      let text = `Picker response: \n${JSON.stringify(data, null, 2)}\n`;
      const document = data[google.picker.Response.DOCUMENTS][0];
      const fileId = document[google.picker.Document.ID];
      console.log(fileId);
      gapi.client.drive.files
        .get({
          fileId: fileId,
          fields: '*',
        })
        .then((res: any) => {
          text += `Drive API response for first document: \n${JSON.stringify(res.result, null, 2)}\n`;
          const contentElement = document.getElementById('content');
          if (contentElement) {
            contentElement.innerText = text;
          }
        });
    }
  }
}