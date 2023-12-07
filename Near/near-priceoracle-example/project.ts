import {
  NearDatasourceKind,
  NearHandlerKind,
  NearProject,
} from "@subql/types-near";

const project: NearProject = {
  specVersion: "1.0.0",
  name: "near_priceoracle_example",
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
    "This project can be use as a starting point for developing your \
        new NEAR Aurora EVM SubQuery Project. It indexes transfers and approvals for the wrapped NEAR token on Aurora",
  repository: "https://github.com/subquery/near-subql-starter",
  schema: {
    file: "./schema.graphql",
  },
  network: {
    // chainId is the EVM Chain ID, for Near Aurora this is 1313161554
    // https://chainlist.org/chain/1313161554
    chainId: "mainnet",
    /**
     * These endpoint(s) should be public non-pruned archive node
     * We recommend providing more than one endpoint for improved reliability, performance, and uptime
     * Public nodes may be rate limited, which can affect indexing speed
     * When developing your project we suggest getting a private API key
     * If you use a rate limited endpoint, adjust the --batch-size and --workers parameters
     * These settings can be found in your docker-compose.yaml, they will slow indexing but prevent your project being rate limited
     */
    endpoint: ["https://archival-rpc.mainnet.near.org"],
    bypassBlocks: [81003306], // This is a missing block from the NEAR mainnet chain that we are skipping
  },
  dataSources: [
    {
      kind: NearDatasourceKind.Runtime, // We use ethereum runtime since NEAR Aurora is a layer-2 that is compatible
      startBlock: 50838152, // You can set any start block you want here. This block was when app.nearcrowd.near was created https://nearblocks.io/txns/6rq4BNMpr8RwxKjfGYbruHhrL1ETbNzeFwcppGwZoQBY
      mapping: {
        file: "./dist/index.js",
        handlers: [
          {
            handler: "handleNewOracle",
            kind: NearHandlerKind.Action, // We use ethereum runtime since NEAR Aurora is a layer-2 that is compatible
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

export default project;
