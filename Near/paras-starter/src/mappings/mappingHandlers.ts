import { NearActionEntity, NearBlockEntity, NearTxEntity } from "../types";
import {
  NearTransaction,
  NearBlock,
  NearAction,
  Transfer,
} from "@subql/types-near";
import { FunctionCall } from "@subql/types-near";

/* export async function handleBlock(block: NearBlock): Promise<void> {
  logger.info(`Handling block ${block.header.height}`);

  const blockRecord = NearBlockEntity.create({
    id: block.header.height.toString(),
    hash: block.header.hash,
    author: block.author,
    timestamp: BigInt(block.header.timestamp),
  });

  await blockRecord.save();
}
 */
export async function handleTransaction(
  transaction: NearTransaction,
): Promise<void> {
  logger.info(`Handling transaction at ${transaction.block_height}`);
  logger.info(`IN TRANSACTION FUNCTION`);

  const transactionRecord = NearTxEntity.create({
    id: `${transaction.block_hash}-${transaction.result.id}`,
    block: transaction.block_height,
    signer: transaction.signer_id,
    receiver: transaction.receiver_id,
  });

  await transactionRecord.save();
}

export async function handleAction(
  action: NearAction<FunctionCall>,
): Promise<void> {
  logger.info(`Handling action at ${action.transaction.block_height}`);

  const actionRecord = NearActionEntity.create({
    id: `${action.transaction.result.id}-${action.id}`,
    sender: action.transaction.signer_id,
    receiver: (action.action as FunctionCall).args
      .toJson()
      .receiver_id.toString(),
    amount: BigInt(
      (action.action as FunctionCall).args.toJson().amount.toString(),
    ),
    msg: (action.action as FunctionCall).args.toJson().msg.toString(),
  });

  await actionRecord.save();
}
