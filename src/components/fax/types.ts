export interface FaxRecipient {
  faxNumber: string;
  toHeader?: string;
}

export interface ListInfo {
  id: string;
  fileName: string;
  recipientCount: number;
  mapping: {
    faxNumber: string;
    toHeader?: string;
  };
  hasInternational: boolean;
}

export interface ColumnMapping {
  faxNumber: string;
  toHeader?: string;
}