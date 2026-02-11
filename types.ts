export enum ConversionDirection {
  UnicodeToBijoy = 'UnicodeToBijoy',
  BijoyToUnicode = 'BijoyToUnicode',
}

export interface ConversionHistoryItem {
  id: string;
  original: string;
  converted: string;
  direction: ConversionDirection;
  timestamp: number;
}
