"use client";

import { nftMintSchema } from "@/schemas";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { type ThirdwebContract } from "thirdweb";
import { claimTo } from "thirdweb/extensions/erc1155";
import {
   useActiveAccount,
   useActiveWalletChain,
   useReadContract,
   useSendTransaction,
   useSwitchActiveWalletChain,
   useWaitForReceipt,
} from "thirdweb/react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { DEFAULT_QUALITY } from "./config";

type Props = {
   contract: ThirdwebContract;
   displayName: string;
   description: string;
   contractImage: string;
   tokenId: bigint;
   symbol: string;
};

export const useNftMint = (props: Props) => {
   const contract = props.contract;
   const form = useForm<z.infer<typeof nftMintSchema>>({
      resolver: zodResolver(nftMintSchema),
      defaultValues: {
         useCustomAddress: false,
      },
   });
   const [useCustomAddress, setUseCustomAddress] = useState(false);

   const account = useActiveAccount();
   const activeChain = useActiveWalletChain();
   const switchChain = useSwitchActiveWalletChain();
   const {
      mutate: sendTransaction,
      isPending: isPendingSendTransaction,
      data,
   } = useSendTransaction();

   const { isLoading, isSuccess } = useWaitForReceipt(
      data ? { ...data, maxBlocksWaitTime: 3 } : undefined
   );

   useEffect(() => {
      const chainOfWallet = activeChain?.id;
      const chainOfContract = contract.chain.id;
      const hasAccount = account && account?.address;

      if (hasAccount && chainOfContract && chainOfContract !== chainOfWallet) {
         try {
            switchChain({ id: contract.chain.id, rpc: contract.chain.rpc });
         } catch (error) {
            console.error("Error switching chain!");
         }
      }
   }, [switchChain, account, contract.chain.id]);

   const isDisabledMintBtn = isPendingSendTransaction || isLoading;

   const onSubmit = async (values: z.infer<typeof nftMintSchema>) => {
      if (!account || !account?.address) {
         return;
      }
      const { customAddress } = values;
      const address = customAddress || account?.address!;
      const transaction = claimTo({
         contract,
         to: address,
         quantity: BigInt(DEFAULT_QUALITY),
         tokenId: BigInt(props.tokenId),
      });
      sendTransaction(transaction, {
         onError: (err: Error) => {
            toast.error(err.message);
         },
         onSuccess: () => {
            toast.success("Minted successfully, waiting for confirmation!");
         },
      });
   };

   return {
      useCustomAddress,
      isPendingSendTransaction,
      isDisabledMintBtn,
      form,
      setUseCustomAddress,
      onSubmit,
   };
};
