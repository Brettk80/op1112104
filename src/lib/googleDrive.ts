import { toast } from 'sonner';

// Get the correct origin based on the environment
const getOrigin = () => {
  if (import.meta.env.PROD) {
    return 'https://bolt.new';
  }
  
  // For development, use the exact origin
  return window.location.origin;
};

interface GoogleDriveFile {
  id: string;
  name: string;
  mimeType: string;
  modifiedTime: string;
}

class GoogleDriveService {
  private static instance: GoogleDriveService;
  private pickerApiLoaded = false;
  private pickerCallback: ((data: any) => void) | null = null;

  private constructor() {}

  static getInstance(): GoogleDriveService {
    if (!this.instance) {
      this.instance = new GoogleDriveService();
    }
    return this.instance;
  }

  async loadPicker(): Promise<void> {
    if (this.pickerApiLoaded) return;

    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://apis.google.com/js/api.js';
      script.async = true;
      script.defer = true;
      script.onload = () => {
        window.gapi.load('picker', {
          callback: () => {
            this.pickerApiLoaded = true;
            resolve();
          }
        });
      };
      script.onerror = () => reject(new Error('Failed to load Google Picker API'));
      document.body.appendChild(script);
    });
  }

  async createPicker(token: string, mimeTypes: string[]): Promise<GoogleDriveFile | null> {
    if (!this.pickerApiLoaded) {
      await this.loadPicker();
    }

    return new Promise((resolve) => {
      const picker = new window.google.picker.PickerBuilder()
        .addView(new window.google.picker.DocsView()
          .setMimeTypes(mimeTypes.join(','))
          .setMode(window.google.picker.DocsViewMode.LIST))
        .setOAuthToken(token)
        .setDeveloperKey(import.meta.env.VITE_GOOGLE_API_KEY)
        .setCallback((data: any) => {
          if (data.action === window.google.picker.Action.PICKED) {
            const file = data.docs[0];
            resolve({
              id: file.id,
              name: file.name,
              mimeType: file.mimeType,
              modifiedTime: new Date(file.lastEditedUtc).toISOString()
            });
          } else if (data.action === window.google.picker.Action.CANCEL) {
            resolve(null);
          }
        })
        .setOrigin(getOrigin())
        .build();

      picker.setVisible(true);
    });
  }

  async downloadFile(fileId: string, token: string): Promise<Blob> {
    const response = await fetch(
      `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );

    if (!response.ok) {
      throw new Error('Failed to download file from Google Drive');
    }

    return response.blob();
  }
}

export default GoogleDriveService;