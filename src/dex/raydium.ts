// import {
//   Liquidity,
//   Token,
//   TokenAmount,
//   TOKEN_PROGRAM_ID,
//   Percent,
// } from "@raydium-io/raydium-sdk";
// import BN from "bn.js";

// import { solanaConnection } from "../solona/connection";
// import { DexQuote } from "../types/dex";
// import { RAYDIUM_SOL_USDC_POOL } from "./raydiumPools";

// /**
//  * Get a real Raydium quote (read-only)
//  * SOL → USDC
//  */
// export async function getRaydiumQuote(
//   inputAmountSol: number
// ): Promise<DexQuote> {
//   /**
//    * Input token (WSOL)
//    */
//   const inputToken = new Token(
//     TOKEN_PROGRAM_ID,
//     RAYDIUM_SOL_USDC_POOL.baseMint,
//     RAYDIUM_SOL_USDC_POOL.baseDecimals,
//     "WSOL"
//   );

//   const amountIn = new TokenAmount(
//     inputToken,
//     new BN(inputAmountSol * 1e9)
//   );

//   /**
//    * Fetch pool runtime state
//    */
//   const poolInfo = await Liquidity.fetchInfo({
//     connection: solanaConnection,
//     poolKeys: RAYDIUM_SOL_USDC_POOL,
//   });

//   /**
//    * Output token (USDC)
//    */
//   const outputToken = new Token(
//     TOKEN_PROGRAM_ID,
//     RAYDIUM_SOL_USDC_POOL.quoteMint,
//     RAYDIUM_SOL_USDC_POOL.quoteDecimals,
//     "USDC"
//   );

//   /**
//    * Compute output amount
//    */
//   const { amountOut } = Liquidity.computeAmountOut({
//     poolKeys: RAYDIUM_SOL_USDC_POOL,
//     poolInfo,
//     amountIn,
//     currencyOut: outputToken,
//     slippage: new Percent(0, 100), // ✅ FIXED
//   });

//   return {
//     dex: "Raydium",
//     inputAmount: inputAmountSol,
//     outputAmount:
//       amountOut.raw.toNumber() /
//       10 ** RAYDIUM_SOL_USDC_POOL.quoteDecimals, // ✅ FIXED
//     poolAddress: RAYDIUM_SOL_USDC_POOL.id.toBase58(),
//   };
// }
