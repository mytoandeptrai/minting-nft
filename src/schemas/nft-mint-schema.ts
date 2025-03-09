import { z } from "zod";

const walletAddressRegex = /^(0x)[0-9a-fA-F]{40}$/;

export const addressSchema = z.string().regex(walletAddressRegex, {
   message: "Invalid wallet address",
});

export const nftMintSchema = z.object({
   customAddress: z
      .string()
      .regex(walletAddressRegex, {
         message: "Invalid wallet address",
      })
      .optional(),
   useCustomAddress: z.boolean(),
});
