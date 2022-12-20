// Copyright 2020-2022 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0
import {
  NearActionEntity,
  NearBlockEntity,
  NearTxEntity
} from "../types";
import {
  NearTransaction,
  NearBlock,
  NearAction,
  Transfer
} from "@subql/types-near";

export async function handleBlock(block: NearBlock): Promise<void> {
  logger.info(`Handling block ${block.header.height}`);
  const blockRecord = new NearBlockEntity(block.header.height.toString());

  blockRecord.hash = block.header.hash;
  blockRecord.author = block.author;
  blockRecord.timestamp = BigInt(block.header.timestamp);
  await blockRecord.save();
}

export async function handleTransaction(
  transaction: NearTransaction
): Promise<void> {
  const transactionRecord = new NearTxEntity(
    `${transaction.block_hash}-${transaction.result.id}`
  );
  
  transactionRecord.signer = transaction.signer_id;
  transactionRecord.receiver = transaction.receiver_id;
  await transactionRecord.save();
}

export async function handleAction(
  action: NearAction
): Promise<void> {
  action = action as NearAction<Transfer>;

  const actionRecord = new NearActionEntity(
    `${action.transaction.result.id}-${action.id}`
  )

  actionRecord.sender = action.transaction.signer_id;
  actionRecord.receiver = action.transaction.receiver_id;
  actionRecord.amount = BigInt((action.action as Transfer).deposit.toString());

  await actionRecord.save();
}