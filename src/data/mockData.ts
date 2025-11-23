import { ServiceFeesByDeliveryScope } from "@/types/serviceFee";

export const mockServiceFeesData: ServiceFeesByDeliveryScope = {
  serviceFeesByDeliveryScope: [
    {
      nameTab: "Domestic Delivery",
      currency: "VND",
      serviceFees: [
        {
          serviceType: "EXPRESS",
          calcFeeType: "BY_WEIGHT",
          fee: 50000,
          weightFrom: 0,
          weightTo: 5,
          distanceFrom: 0,
          distanceTo: 50,
          packageType: "STANDARD",
          category: "DOCUMENTS",
          zoneFromCode: "HN",
          zoneToCode: "HCM",
          shippingType: "AIR",
          calcCondition: "WEIGHT_BASED",
          fees: {
            base: 30000,
            additional: 20000,
          },
        },
        {
          serviceType: "STANDARD",
          calcFeeType: "BY_DISTANCE",
          fee: 35000,
          weightFrom: 0,
          weightTo: 10,
          distanceFrom: 50,
          distanceTo: 200,
          packageType: "STANDARD",
          category: "GOODS",
          zoneFromCode: "HN",
          zoneToCode: "DN",
          shippingType: "ROAD",
          calcCondition: "DISTANCE_BASED",
          fees: {
            base: 25000,
            additional: 10000,
          },
        },
      ],
    },
    {
      nameTab: "International Delivery",
      currency: "USD",
      serviceFees: [
        {
          serviceType: "EXPRESS_INTERNATIONAL",
          calcFeeType: "BY_WEIGHT_AND_ZONE",
          fee: 120,
          weightFrom: 0,
          weightTo: 2,
          distanceFrom: 0,
          distanceTo: 5000,
          packageType: "PREMIUM",
          category: "ELECTRONICS",
          zoneFromCode: "VN",
          zoneToCode: "US",
          shippingType: "AIR_EXPRESS",
          calcCondition: "WEIGHT_ZONE_BASED",
          fees: {
            base: 80,
            fuel_surcharge: 20,
            handling: 20,
          },
        },
      ],
    },
  ],
};
