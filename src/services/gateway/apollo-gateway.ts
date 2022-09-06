import { ApolloServer } from "apollo-server-lambda";
import { ApolloGateway, IntrospectAndCompose } from "@apollo/gateway";
import { ApolloServerPluginLandingPageLocalDefault } from "apollo-server-core";

const localUrl = process.env.LOCAL_URL;
let urls = [
  { name: "cars", url: `${localUrl}/cars` },
  { name: "chargers", url: `${localUrl}/chargers` },
  { name: "drivers", url: `${localUrl}/drivers` },
];
if (!process.env.IS_OFFLINE) {
  const url = process.env.URL;
  const marketsUrl = process.env.MARKETS_URL;
  urls = [
    { name: "cars", url: `${url}/cars` },
    { name: "chargers", url: `${url}/chargers` },
    { name: "drivers", url: `${url}/drivers` },
  ];
}
console.log("-------- SUBGRAPHS ", {
  isOffline: process.env.IS_OFFLINE,
  urls: JSON.stringify(urls),
});

const gateway = new ApolloGateway({
  supergraphSdl: new IntrospectAndCompose({
    subgraphs: urls,
  }),
});

export const server = new ApolloServer({
  gateway,
  csrfPrevention: true,
  cache: "bounded",
  plugins: [ApolloServerPluginLandingPageLocalDefault({ embed: true })],
});
