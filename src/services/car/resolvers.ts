import { ICar } from "./models/Car";
import { carService } from "./car-service";

export const resolvers = {
  Query: {
    cars: (_, { ids }: { ids?: string[] }) => {
      console.log("------------------------- CAR - CARS");
      return carService.list(ids);
    },
  },
  Car: {
    drivers(car: ICar, args, context) {
      console.log("-------------------------  CAR - DRIVERS", {
        car,
        args,
      });
      return car?.driverIds?.map((id) => ({
        __typename: "Driver",
        id,
      }));
    },
    __resolveReference: async (reference: ICar, ctx) => {
      console.log("####### Resolve Car", reference);
      return await ctx.dataLoaders.car.load(reference.id);
    },
  },
  Mutation: {
    addCar: async (_: undefined, { car }: { car: ICar }) => {
      const c = carService.create(car);
      return c;
    },
    updateCar: async (_: undefined, { car }: { car: ICar }) => {
      if (car.id === undefined) {
        return car;
      }
      const newCar = await carService.update(car);
      return newCar;
    },
    deleteCar: async (_: undefined, { id }: { id: string }) => {
      await carService.remove(id);
      return id;
    },
  },
  Driver: {
    cars: (driver: { id: string }) => {
      console.log("###### CAR RESOLVER - extend Driver, resolve Car", {
        driver,
      });
      return carService.searchInList(driver.id, "driverIds");
    },
  },
};
