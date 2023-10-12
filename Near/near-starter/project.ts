import {
  NearDatasourceKind,
  NearHandlerKind,
  NearProject,
} from "@subql/types-near";

const project: NearProject = {
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
  description: "This is an example project that indexes price oracle feeds from the NEAR blockchain using SubQuery",
  repository: "https://github.com/subquery/near-subql-starter",
  schema: {
    file: "./schema.graphql",
  },
  network: {
    // chainId is the EVM Chain ID, for Near Aurora this is 1313161554
    // https://chainlist.org/chain/1313161554
    chainId: "mainnet",
    // This endpoint must be a public non-pruned archive node
    // We recommend providing more than one endpoint for improved reliability, performance, and uptime
    // Public nodes may be rate limited, which can affect indexing speed
    // When developing your project we suggest getting a private API key from a commercial provider
    endpoint: ["https://archival-rpc.mainnet.near.org"],
    // Recommended to provide the HTTP endpoint of a full chain dictionary to speed up processing
    dictionary: 'https://api.subquery.network/sq/subquery/near-dictionary',
    bypassBlocks: [81003306] // This is a missing block from the NEAR mainnet chain that we are skipping
  },
  dataSources: [
    {
      kind: NearDatasourceKind.Runtime, // We use ethereum runtime since NEAR Aurora is a layer-2 that is compatible
      startBlock: 80980000, // You can set any start block you want here. This block was when the sweat_welcome.near address was created
      mapping: {
        file: "./dist/index.js",
        handlers: [
          {
            handler: "handleTransaction",
            kind: NearHandlerKind.Transaction, // We use ethereum runtime since NEAR Aurora is a layer-2 that is compatible
            filter: {
              sender: 'sweat_welcome.near',
              receiver: 'token.sweat'
            },
          },
          {
            handler: "handleAction",
            kind: NearHandlerKind.Action,
            filter: {
              type: 'FunctionCall',
              methodName: 'storage_deposit',
              receiver: 'token.sweat'
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
