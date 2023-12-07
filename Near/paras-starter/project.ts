import {
  NearDatasourceKind,
  NearHandlerKind,
  NearProject,
} from "@subql/types-near";

const project: NearProject = {
  specVersion: "1.0.0",
  name: "near-starter",
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
    "This project can be use as a starting point for developing yournew NEAR SubQuery project",
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
      startBlock: 85093400, // You can set any start block you want here. This block was when the sweat_welcome.near address was created
      mapping: {
        file: "./dist/index.js",
        handlers: [
          {
            handler: "handleTransaction",
            kind: NearHandlerKind.Transaction, // We use ethereum runtime since NEAR Aurora is a layer-2 that is compatible
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
              /*
              Filter examples
           filter:
              type: DeleteAccount
              beneficiaryId: ""
           filter:
              type: AddKey
              publicKey: ""
              accessKey: ""
           filter:
              type: DeleteKey
              publicKey: ""
           filter:
              type: Stake
              publicKey: ""
               */
            },
          },
        ],
      },
    },
  ],
};

export default project;
