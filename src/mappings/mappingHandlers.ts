// Copyright 2020-2022 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0
import { NearActionEntity, NearBlockEntity, NearTxEntity } from "../types";
import {
  NearTransaction,
  NearBlock,
  NearAction,
  Transfer,
} from "@subql/types-near";

export async function handleBlock(block: NearBlock): Promise<void> {
  logger.info(`Handling block ${block.header.height}`);
  const blockRecord = NearBlockEntity.create({
    id: block.header.height.toString(),
    hash: block.header.hash,
    author: block.author,
    timestamp: BigInt(block.header.timestamp),
  });

  await blockRecord.save();
}

export async function handleTransaction(
  transaction: NearTransaction
): Promise<void> {
  const transactionRecord = NearTxEntity.create({
    id: `${transaction.block_hash}-${transaction.result.id}`,
    signer: transaction.signer_id,
    receiver: transaction.receiver_id,
  });

  await transactionRecord.save();
}

export async function handleAction(action: NearAction): Promise<void> {
  action = action as NearAction<Transfer>;

  const actionRecord = NearActionEntity.create({
    id: `${action.transaction.result.id}-${action.id}`,
    sender: action.transaction.signer_id,
    receiver: action.transaction.receiver_id,
    amount: BigInt((action.action as Transfer).deposit.toString()),
  });

  await actionRecord.save();
}
