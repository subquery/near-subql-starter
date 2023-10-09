import {
  NearDatasourceKind,
  NearHandlerKind,
  NearProject,
} from "@subql/types-near";

const project: NearProject = {
  specVersion: "1.0.0",
  name: "near-priceoracle-example",
  version: "0.0.1",
  runner: {
    node: {
      name: "@subql/node-near",
      version: "*",
    },
    query: {
      name: "@subql/query",
      version: "*",
    },
  },
  description:
    "This is an example project that indexes price oracle feeds from the NEAR blockchain using SubQuery",
  repository: "https://github.com/subquery/near-subql-starter",
  schema: {
    // This endpoint must be a public non-pruned archive node
    // We recommend providing more than one endpoint for improved reliability, performance, and uptime
    // Public nodes may be rate limited, which can affect indexing speed
    // When developing your project we suggest getting a private API key from a commercial provider
    file: "./schema.graphql",
  },
  network: {
    chainId: "mainnet",
    endpoint: ["https://archival-rpc.mainnet.near.org"],
    // Optionally provide the HTTP endpoint of a full chain dictionary to speed up processing
    dictionary: "https://api.subquery.network/sq/subquery/near-dictionary",
    // This is a missing block from the NEAR mainnet chain that we are skipping
    bypassBlocks: [81003306],
  },
  dataSources: [
    {
      kind: NearDatasourceKind.Runtime,
      // You can set any start block you want here. This block was when app.nearcrowd.near was created https://nearblocks.io/txns/6rq4BNMpr8RwxKjfGYbruHhrL1ETbNzeFwcppGwZoQBY
      startBlock: 84662303,
      mapping: {
        file: "./dist/index.js",
        handlers: [
          {
            handler: "handleNewOracle",
            kind: NearHandlerKind.Action,
            filter: {
              type: "FunctionCall",
              methodName: "add_oracle",
              receiver: "priceoracle.near",
            },
          },
          {
            handler: "handleNewPrice",
            kind: NearHandlerKind.Action,
            filter: {
              type: "FunctionCall",
              methodName: "report_prices",
              receiver: "priceoracle.near",
            },
          },
        ],
      },
    },
  ],
};

// Must set default to the project instance
export default project;
