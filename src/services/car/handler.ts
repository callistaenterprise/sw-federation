import { server } from './apollo-server';

export const apolloServerHandler = server.createHandler();

export const graphql = apolloServerHandler;
