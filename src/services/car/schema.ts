import { gql } from "apollo-server-lambda";

export const typeDefs = gql`
  type Car @key(fields: "id") {
    id: ID!
    registrationNumber: String
    name: String
    vin: String
    model: String
    modelYear: String
    batterySize: Int
    driverIds: [ID]
    drivers: [Driver]
  }

  input CarInput {
    registrationNumber: String
    name: String
    vin: String
    model: String
    modelYear: String
    batterySize: Int
    driverIds: [String]
    chargerId: String
  }

  input CarUpdateInput {
    id: String!
    registrationNumber: String
    name: String
    vin: String
    model: String
    modelYear: String
    batterySize: Int
    driverIds: [String]
    chargerId: String
  }

  type Query {
    cars(ids: [ID]): [Car]
  }

  type Mutation {
    addCar(car: CarInput!): Car
    deleteCar(id: String!): String
    updateCar(car: CarUpdateInput!): Car
  }

  extend type Driver @key(fields: "id") {
    id: ID @external
    cars: [Car]
  }
`;
