import { gql } from "apollo-server-lambda";

export const typeDefs = gql`
  type Charger @key(fields: "id") {
    id: ID!
    serialNumber: String
    vendor: String
    productName: String
    color: String
    status: String
    driverId: String
    driver: Driver
    carId: String
    car: Car
  }

  input ChargerInput {
    serialNumber: String
    vendor: String
    productName: String
    color: String
    status: String
    driverId: String
    carId: String
  }

  input ChargerUpdateInput {
    id: String!
    serialNumber: String
    vendor: String
    productName: String
    color: String
    status: String
    driverId: String
    carId: String
  }

  type Query {
    chargers(ids: [ID]): [Charger]
  }

  type Mutation {
    addCharger(charger: ChargerInput!): Charger
    deleteCharger(id: String!): String
    updateCharger(charger: ChargerUpdateInput!): Charger
  }

  extend type Car @key(fields: "id") {
    id: ID @external
    chargers: [Charger]
  }

  extend type Driver @key(fields: "id") {
    id: ID! @external
    chargers: [Charger]
  }
`;
