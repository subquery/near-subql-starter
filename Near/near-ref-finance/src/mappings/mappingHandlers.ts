import { Swap, Token, Pool } from "../types";
import { NearAction } from "@subql/types-near";

export async function handleAction(action: NearAction): Promise<void> {
  logger.info(`Swap found at block ${action.transaction.block_height}`);
  // An Action can belong to either a transaction or a receipt
  // To check which one, we can check if action.transaction is null
  // If it is null, then it belongs to a receipt
  if (!action.transaction) {
    return;
  }
  let actions = action.action.args.toJson()["actions"];

  for (let i = 0; i < actions.length; i++) {
    Swap.create({
      id: `${action.transaction.block_height}-${action.transaction.result.id}-${action.id}-${i}`,
      poolId: (await getOrCreatePool(JSON.stringify(actions[i]["pool_id"]))).id,
      firstTokenId: (
        await getOrCreateToken(JSON.stringify(actions[i]["token_in"]))
      ).id,
      secondTokenId: (
        await getOrCreateToken(JSON.stringify(actions[i]["token_out"]))
      ).id,
    }).save();
    logger.info("Swap is saved");
  }
}

async function getOrCreateToken(tokenid: string): Promise<Token> {
  let token = await Token.get(tokenid);
  if (token === undefined) {
    token = Token.create({ id: tokenid });
    await token.save();
  }
  return token;
}

async function getOrCreatePool(poolid: string): Promise<Pool> {
  let pool = await Token.get(poolid);
  if (pool === undefined) {
    pool = Token.create({ id: poolid });
    await pool.save();
  }
  return pool;
}
