// import {
//   Liquidity,
//   Token,
//   TokenAmount,
//   TOKEN_PROGRAM_ID,
//   TxVersion,
// } from "@raydium-io/raydium-sdk";
// import { Transaction } from "@solana/web3.js";
// import BN from "bn.js";

// import { solanaConnection } from "../solona/connection";
// import { loadDevnetWallet } from "../solona/wallet";
// import { RAYDIUM_SOL_USDC_POOL } from "../dex/raydiumPools";

// export async function buildAndSendRaydiumSwap(
//   amountInSol: number,
//   minAmountOut: number
// ): Promise<string> {
//   const wallet = loadDevnetWallet();

//   // Input token (WSOL)
//   const inputToken = new Token(
//     TOKEN_PROGRAM_ID,
//     RAYDIUM_SOL_USDC_POOL.baseMint,
//     9,
//     "WSOL"
//   );

//   const amountIn = new TokenAmount(
//     inputToken,
//     new BN(amountInSol * 1e9)
//   );

//   // Output token (USDC)
//   const outputToken = new Token(
//     TOKEN_PROGRAM_ID,
//     RAYDIUM_SOL_USDC_POOL.quoteMint,
//     6,
//     "USDC"
//   );

//   const amountOut = new TokenAmount(
//     outputToken,
//     new BN(minAmountOut * 1e6)
//   );

//   // ✅ Correct Raydium swap builder
//   const { innerTransactions } =
//     await Liquidity.makeSwapInstructionSimple({
//       connection: solanaConnection,
//       poolKeys: RAYDIUM_SOL_USDC_POOL,
//       userKeys: {
//         owner: wallet.publicKey,
//         tokenAccounts: [],
//       },
//       amountIn,
//       amountOut,
//       fixedSide: "in",

//       // REQUIRED in your SDK
//       makeTxVersion: TxVersion.V0,
//     });

//   const tx = new Transaction();
//   tx.add(...innerTransactions[0].instructions);

//   tx.feePayer = wallet.publicKey;
//   tx.recentBlockhash =
//     (await solanaConnection.getLatestBlockhash()).blockhash;

//   tx.sign(wallet);

//   const txHash =
//     await solanaConnection.sendRawTransaction(
//       tx.serialize()
//     );

//   await solanaConnection.confirmTransaction(
//     txHash,
//     "confirmed"
//   );

//   return txHash;
// }
