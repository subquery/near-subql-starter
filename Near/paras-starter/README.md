# SubQuery - Starter Package

The Starter Package is an example that you can use as a starting point for developing your SubQuery project. A SubQuery Project defines which data will be index from your specified blockchain of chice and how it will store it.

This is a specific starter project for the NEAR blockchain. It indexes all Sweatcoin transactions where the receiver is token.sweat and the sender is sweat_welcome.near. It also indexes all storage_deposit calls for the same contract.

## Preparation

#### Environment

- [Typescript](https://www.typescriptlang.org/) are required to compile project and define types.

- Both SubQuery CLI and generated Project have dependencies and require [Node](https://nodejs.org/en/).

#### Install the SubQuery CLI

Install SubQuery CLI globally on your terminal by using NPM:

```
npm install -g @subql/cli
```

Run help to see available commands and usage provide by CLI

```
subql help
```

## Initialize the starter package

Replace `project-name` with your project name and run the command:

```
subql init --starter project-name
```

This creates a simple working example project to start the creation of your own project. 

Next, under the project directory, run following command to install all the dependency.

```
yarn install
```

## Configure your project

In the starter project, you will be mainly working with the following 3 files:

- The GraphQL Schema in `schema.graphql`
- The Manifest in `project.yaml`
- The Mapping functions in `src/mappings/` directory

### Code generation

Run the following command to generate the typescript entities from your schemal file.

```
yarn codegen
```

### Build the project

Run the following command to build your project.

```
yarn build
```

## Indexing and Query

### Docker

In the project directory, start docker.

```
yarn start:docker
```

### Query the project

Open your browser and head to `http://localhost:3000`.

You should see a GraphQL playground ready to accept queries.

For the `subql-starter` project, you can run the following query:

```graphql
query {
  nearTxEntities(first: 10) {
    totalCount
    nodes {
      id
      block
      receiver
      signer
    }
  }
  nearActionEntities(first: 10) {
    totalCount
    nodes {
      id
      block
      receiver
      sender
      amount
      msg
    }
  }
}
```

The query above returns the first 5 transaction ids along with the first 5 action ids. Note: In NEAR, a [Transaction](https://docs.near.org/concepts/basics/transactions/overview#transaction)) is a collection of Actions that describe what should be done at the destination (the receiver account).

An [Action](https://docs.near.org/concepts/basics/transactions/overview#action) is a composable unit of operation that, together with zero or more other Actions, defines a sensible Transaction. 

The expected output:

```graphql
{
  "data": {
    "nearTxEntities": {
      "totalCount": 1,
      "nodes": [
        {
          "id": "FFH5vitmHxiCkY12iChfC5CkfnjVVCR4mqZNjCTioGoR-BBJQyuL3qinBVSHWtpLC5MmZp6v2ecfBdZATDv6TamMt",
          "block": 85093424,
          "receiver": "token.paras.near",
          "signer": "isaaap.near"
        }
      ]
    },
    "nearActionEntities": {
      "totalCount": 1,
      "nodes": [
        {
          "id": "BBJQyuL3qinBVSHWtpLC5MmZp6v2ecfBdZATDv6TamMt-0",
          "block": null,
          "receiver": "staking.paras.near",
          "sender": "isaaap.near",
          "amount": "1326000000000000000000",
          "msg": ""
        }
      ]
    }
  }
}
```

Cross check at: https://explorer.near.org/blocks/FFH5vitmHxiCkY12iChfC5CkfnjVVCR4mqZNjCTioGoR