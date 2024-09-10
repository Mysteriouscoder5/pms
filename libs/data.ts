import { faker } from "@faker-js/faker";
interface Lot {
  id: string;
  occupied: boolean;
  number: number;
  ownerName?: string;
  ownerContactNumber?: string;
  vehicleNumber?: string;
  parkingDate?: string;
  parkingTime?: string;
}
export function createRandomLot(number: number): Lot {
  const occupied = Math.random() > 0.5;
  return {
    id: faker.string.uuid(),
    occupied: occupied,
    number: number,
    ownerName: occupied ? faker.person.fullName() : undefined,
    ownerContactNumber: occupied
      ? faker.helpers.fromRegExp("[0-9]{3} [0-9]{3} [0-9]{4}")
      : undefined,
    vehicleNumber: occupied
      ? faker.helpers.fromRegExp("[A-Z]{2} [0-9]{2} [A-Z]{2} [0-9]{4}")
      : undefined,
    parkingDate: occupied
      ? faker.date.recent().toISOString().split("T")[0]
      : undefined,
    parkingTime: occupied
      ? faker.date.recent().toISOString().split("T")[1].split(".")[0]
      : undefined,
  };
}

const createMultipleLots = (count: number): Lot[] => {
  return Array.from({ length: count }, (_, index) =>
    createRandomLot(index + 1)
  );
};

export const LOTS: Lot[] = createMultipleLots(20);
