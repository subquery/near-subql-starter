import { NearDatasourceKind, NearHandlerKind, NearProject } from "@subql/types-near";

const project: NearProject = {
    // This project can be use as a starting point for developing your new NEAR SubQuery project
    specVersion: "1.0.0",
    name: "near-subql-starter",
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
    description: "This project can be use as a starting point for developing your new NEAR SubQuery project",
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
        // You can set any start block you want here. This block was when the sweat_welcome.near address was created
        startBlock: 80980000,
        mapping: {
          file: "./dist/index.js",
          handlers: [
            // Using block handlers slows your project down as they can be executed with each and every block. Only use if you need to
            // {
            //   handler: "handleBlock",
            //   kind: "near/BlockHandler",
            //   filter: {
            //     modulo: 10,
            //   },
            // },
            {
              handler: "handleTransaction",
              kind: NearHandlerKind.Transaction,
              filter: {
                sender: "sweat_welcome.near",
                receiver: "token.sweat",
              },
            },
            {
              handler: "handleAction",
              kind: NearHandlerKind.Action,
              filter: {
                type: "FunctionCall",
                methodName: "storage_deposit",
                receiver: "token.sweat",
              },
            },
            // Some other filter examples
            // {
            //   handler: "handleAction",
            //   kind: NearHandlerKind.Action,
            //   filter: {
            //     type: "DeleteAccount",
            //     beneficiaryId: "",
            //   },
            // },
            // {
            //   handler: "handleAction",
            //   kind: NearHandlerKind.Action,
            //   filter: {
            //     type: "AddKey",
            //     publicKey: "",
            //     accessKey: "",
            //   },
            // },
            // {
            //   handler: "handleAction",
            //   kind: NearHandlerKind.Action,
            //   filter: {
            //     type: "DeleteKey",
            //     publicKey: "",
            //   },
            // },
            // {
            //   handler: "handleAction",
            //   kind: NearHandlerKind.Action,
            //   filter: {
            //     type: "Stake",
            //     publicKey: "",
            //   },
            // },
          ],
        },
      },
    ],
  };

  export default project;