import {
  EthereumDatasourceKind,
  EthereumHandlerKind,
  EthereumProject,
} from "@subql/types-ethereum";

const project: EthereumProject = {
  specVersion: "1.0.0",
  name: "near-aurora-starter",
  version: "0.0.1",
  runner: {
    node: {
      name: "@subql/node-ethereum",
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
    chainId: "1313161554",
    /**
     * These endpoint(s) should be public non-pruned archive node
     * We recommend providing more than one endpoint for improved reliability, performance, and uptime
     * Public nodes may be rate limited, which can affect indexing speed
     * When developing your project we suggest getting a private API key
     * If you use a rate limited endpoint, adjust the --batch-size and --workers parameters
     * These settings can be found in your docker-compose.yaml, they will slow indexing but prevent your project being rate limited
     */
    endpoint: ["https://mainnet.aurora.dev"],
  },
  dataSources: [
    {
      kind: EthereumDatasourceKind.Runtime, // We use ethereum runtime since NEAR Aurora is a layer-2 that is compatible
      startBlock: 42731897, // Block with the first interaction with NEAR https://explorer.aurora.dev/tx/0xc14305c06ef0a271817bb04b02e02d99b3f5f7b584b5ace0dab142777b0782b1
      options: {
        // Must be a key of assets
        abi: "erc20",
        address: "0xC42C30aC6Cc15faC9bD938618BcaA1a1FaE8501d", // this is the contract address for wrapped NEAR https://explorer.aurora.dev/address/0xC42C30aC6Cc15faC9bD938618BcaA1a1FaE8501d
      },
      assets: new Map([["erc20", { file: "./abis/erc20.abi.json" }]]),
      mapping: {
        file: "./dist/index.js",
        handlers: [
          {
            handler: "handleTransaction",
            kind: EthereumHandlerKind.Call, // We use ethereum runtime since NEAR Aurora is a layer-2 that is compatible
            filter: {
              // The function can either be the function fragment or signature
              // function: '0x095ea7b3'
              // function: '0x7ff36ab500000000000000000000000000000000000000000000000000000000'
              function: "approve(address spender, uint256 rawAmount)",
            },
          },
          {
            handler: "handleLog",
            kind: EthereumHandlerKind.Event,
            filter: {
              // address: "0x60781C2586D68229fde47564546784ab3fACA982"
              topics: [
                //Follows standard log filters https://docs.ethers.io/v5/concepts/events/
                "Transfer(address indexed from, address indexed to, uint256 amount)",
              ],
            },
          },
        ],
      },
    },
  ],
};

export default project;
