import { ApolloServer, gql } from "apollo-server-lambda";
import DataLoader from "dataloader";
import { ApolloServerPluginLandingPageLocalDefault } from "apollo-server-core";
import { buildSubgraphSchema } from "@apollo/subgraph";
import { typeDefs } from "./schema";
import { resolvers } from "./resolvers";
import { driverService } from "./driver-service";

export const server = new ApolloServer({
  schema: buildSubgraphSchema({ typeDefs, resolvers }),
  csrfPrevention: true,
  cache: "bounded",
  plugins: [ApolloServerPluginLandingPageLocalDefault({ embed: true })],
  context: async (props) => {
    console.log(
      "- ------------------------- DRIVER REQ",
      JSON.stringify(props.express.req.body, null, 2)
    );
    return {
      dataLoaders: {
        drivers: new DataLoader(async (ids) => {
          console.log("!!!!!!!!!!! load drivers", ids);
          const data = await driverService.list();
          return data.filter((d) => ids.includes(d.id));
        }),
      },
    };
  },
});
