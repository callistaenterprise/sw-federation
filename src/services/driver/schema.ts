import { gql } from "apollo-server-lambda";

export const typeDefs = gql`
  type Driver @key(fields: "id") {
    id: ID!
    firstName: String
    lastName: String
    email: String
    address: String
    nationalSecurity: String
    age: Int
  }

  input DriverInput {
    firstName: String
    lastName: String
    email: String
    address: String
    nationalSecurity: String
    age: Int
  }

  input DriverUpdateInput {
    id: String!
    firstName: String
    lastName: String
    email: String
    address: String
    nationalSecurity: String
    age: Int
  }

  type Query {
    drivers(ids: [ID]): [Driver]
  }

  type Mutation {
    addDriver(driver: DriverInput!): Driver
    deleteDriver(id: String!): String
    updateDriver(driver: DriverUpdateInput!): Driver
  }
`;
