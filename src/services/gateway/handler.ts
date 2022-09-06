import { server } from './apollo-gateway';

export const apolloServerHandler = server.createHandler();

export const graphql = apolloServerHandler;
