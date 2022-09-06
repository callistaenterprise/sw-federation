import { ApolloServer, gql } from "apollo-server-lambda";
import { ApolloServerPluginLandingPageLocalDefault } from "apollo-server-core";
import { buildSubgraphSchema } from "@apollo/subgraph";
import { typeDefs } from "./schema";
import { resolvers } from "./resolvers";
import DataLoader from "dataloader";
import { carService } from "./car-service";

export const server = new ApolloServer({
  schema: buildSubgraphSchema({ typeDefs, resolvers }),
  context: async (props) => {
    console.log(
      "- ------------------------- CAR REQ",
      JSON.stringify(props.express.req.body, null, 2)
    );
    return {
      ...props,
      dataLoaders: {
        car: new DataLoader(async (ids) => {
          console.log("- 3 --------------- DL CAR By CAR_ID", ids);
          const res = await carService.list();
          return res.filter((c) => ids.includes(c.id));
        }),
      },
    };
  },
  csrfPrevention: true,
  cache: "bounded",
  plugins: [ApolloServerPluginLandingPageLocalDefault({ embed: true })],
});
