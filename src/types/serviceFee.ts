export interface ServiceFee {
  serviceType: string;
  calcFeeType: string;
  fee: number;
  weightFrom: number;
  weightTo: number;
  distanceFrom: number;
  distanceTo: number;
  packageType: string;
  category: string;
  zoneFromCode: string;
  zoneToCode: string;
  shippingType: string;
  calcCondition: string;
  fees?: Record<string, number>;
}

export interface ServiceFeeTab {
  nameTab: string;
  currency: string;
  serviceFees: ServiceFee[];
}

export interface ServiceFeesByDeliveryScope {
  serviceFeesByDeliveryScope: ServiceFeeTab[];
}
