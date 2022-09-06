import { ICharger } from "./models/Charger";
import { chargerService } from "./charger-service";
import { ICar } from "../car/models/Car";

export const resolvers = {
  Query: {
    chargers: (_, { ids }: { ids?: string[] }) => {
      return chargerService.list(ids);
    },
  },
  Mutation: {
    addCharger: async (_: undefined, { charger }: { charger: ICharger }) => {
      const c = chargerService.create(charger);
      console.log("----- charger", { c });
      return c;
    },
    updateCharger: async (_: undefined, { charger }: { charger: ICharger }) => {
      if (charger.id === undefined) {
        return charger;
      }
      console.log("---- update", { charger });
      const newCharger = await chargerService.update(charger);
      return newCharger;
    },
    deleteCharger: async (_: undefined, { id }: { id: string }) => {
      await chargerService.remove(id);
      return id;
    },
  },
  Driver: {
    chargers: async (driver: { id: string }) => {
      return await chargerService.indexedEntities("DriverIndex", {
        driverId: driver.id,
      });
    },
  },
  Charger: {
    car(charger: ICharger) {
      return {
        __typename: "Car",
        id: charger.carId,
      };
    },

    driver(charger: ICharger) {
      console.log("@@@@@@ Charger.driver", charger);
      return {
        __typename: "Driver",
        id: charger.driverId,
      };
    },
    __resolveReference: async (reference: ICharger) => {
      console.log("################## Charger - Resolve", reference);
      return await chargerService.get(reference.id);
    },
  },
  Car: {
    chargers: async (car: { id: string }, _, ctx) => {
      return await chargerService.indexedEntities("CarIndex", {
        carId: car.id,
      });
    },
  },
};
