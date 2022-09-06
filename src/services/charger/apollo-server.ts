import { ApolloServer, gql } from "apollo-server-lambda";
import { ApolloServerPluginLandingPageLocalDefault } from "apollo-server-core";
import { buildSubgraphSchema } from "@apollo/subgraph";
import { typeDefs } from "./schema";
import { resolvers } from "./resolvers";
import DataLoader from "dataloader";
import { chargerService } from "./charger-service";

export const server = new ApolloServer({
  schema: buildSubgraphSchema({ typeDefs, resolvers }),
  csrfPrevention: true,
  cache: "bounded",
  plugins: [ApolloServerPluginLandingPageLocalDefault({ embed: true })],
  context: async (props) => {
    console.log(
      "- ------------------------- CHARGER REQ",
      JSON.stringify(props.express.req.body, null, 2)
    );
    return {
      ...props,
      dataLoaders: {
        chargersByCarId: new DataLoader(async (ids) => {
          console.log("- 3 --------------- DL CHARGERS By CAR_ID", ids);
          // TODO: move this to dynamo helper
          const data = await chargerService.list();
          const res = data.filter((c) => ids.includes(c.carId));
          return res;
        }),
      },
    };
  },
});
