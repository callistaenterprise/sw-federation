import { IDriver, Driver } from "./models/Driver";
import { driverService } from "./driver-service";
export const resolvers = {
  Query: {
    drivers: (_, { ids }: { ids?: string[] }) => {
      console.log("----- DRIVER RESOLVER - QUERY DRIVER");
      return driverService.list(ids);
    },
  },
  Mutation: {
    addDriver: async (_: undefined, { driver }: { driver: IDriver }) => {
      const u = driverService.create(driver);
      return u;
    },
    updateDriver: async (_: undefined, { driver }: { driver: IDriver }) => {
      if (driver.id === undefined) {
        return driver;
      }
      const newDriver = driverService.update(driver);
      return newDriver;
    },
    deleteDriver: async (_: undefined, { id }: { id: string }) => {
      await driverService.remove(id);
      return id;
    },
  },
  Driver: {
    __resolveReference: async (reference: Driver, ctx) => {
      console.log("####### Resolve Drivers", reference);
      return ctx?.dataLoaders.drivers.load(reference.id);
    },
  },
};
