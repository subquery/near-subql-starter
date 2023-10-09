import {
  NearProject,
  NearDatasourceKind,
  NearHandlerKind,
} from "@subql/types-near";

const project: NearProject = {
  specVersion: "1.0.0",
  name: "near_starter",
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
  description: `This project can be use as a starting point for developing your
      new NEAR SubQuery project`,
  repository: "https://github.com/subquery/near-subql-starter",
  schema: {
    file: "./schema.graphql",
  },
  network: {
    chainId: "mainnet",
    // This endpoint must be a public non-pruned archive node
    // Public nodes may be rate limited, which can affect indexing speed
    // When developing your project we suggest getting a private API key from a commercial provider
    endpoint: "https://archival-rpc.mainnet.near.org",
    // Optionally provide the HTTP endpoint of a full chain dictionary to speed up processing
    dictionary: "https://api.subquery.network/sq/subquery/near-dictionary",
    bypassBlocks: [81003306],
  },
  dataSources: [
    {
      kind: NearDatasourceKind.Runtime,
      startBlock: 85093400, // You can set any start block you want here. This block was when the sweat_welcome.near address was created
      mapping: {
        file: "./dist/index.js",
        handlers: [
          // Using block handlers slows your project down as they can be executed with each and every block. Only use if you need to
          // {
          //   handler: "handleBlock",
          //   kind: "near/BlockHandler",
          //   filter: {
          //     modulo: 10
          //   }
          // },
          {
            handler: "handleTransaction",
            kind: NearHandlerKind.Transaction,
            filter: {
              sender: "isaaap.near",
              receiver: "token.paras.near",
            },
          },
          {
            handler: "handleAction",
            kind: NearHandlerKind.Action,
            filter: {
              type: "FunctionCall",
              methodName: "ft_transfer_call",
              receiver: "token.paras.near",
            },
            // Some other filter examples
            // filter: {
            //   type: "DeleteAccount",
            //   beneficiaryId: ""
            // }
            // filter: {
            //   type: "AddKey",
            //   publicKey: "",
            //   accessKey: ""
            // }
            // filter: {
            //   type: "DeleteKey",
            //   publicKey: ""
            // }
            // filter: {
            //   type: "Stake",
            //   publicKey: ""
            // }
          },
        ],
      },
    },
  ],
};

// Must set default to the project instance
export default project;
