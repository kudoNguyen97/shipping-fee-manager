export interface ServiceFee {
    id?: string;
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

export interface ServiceFeeCard {
    id: string;
    cities: string[];
    currency: string;
    serviceFees: ServiceFee[];
}

export interface ServiceFeeTab {
    nameTab: string;
    fromCountry: string;
    toCountry: string;
    cards: ServiceFeeCard[];
}

export interface ServiceFeesByDeliveryScope {
    serviceFeesByDeliveryScope: ServiceFeeTab[];
}
