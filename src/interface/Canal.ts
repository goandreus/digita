export interface Geometry {
  type: string;
  coordinates: number[];
}

export interface Properties {
  active: boolean;
  category: string;
  subcategory: string;
  name: string;
  address: string;
  province: string;
  district: string;
  product: string;
  hours: string;
  icon: string;
  phone: string;
}

export interface Canal {
  id: string;
  type: string;
  geometry: Geometry;
  properties: Properties;
}

export enum Canales {
  BIM = 'BIMs',
  CAJERO = 'Cajeros',
  AGENTE = 'Agentes',
  AGENCIA = 'Agencias',
  CANALES = 'Canales',
}
