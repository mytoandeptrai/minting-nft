"use client";

import { nftMintSchema } from "@/schemas";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { type ThirdwebContract } from "thirdweb";
import { claimTo } from "thirdweb/extensions/erc1155";
import {
   useActiveAccount,
   useActiveWalletChain,
   useSendTransaction,
   useSwitchActiveWalletChain,
   useWaitForReceipt,
} from "thirdweb/react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { DEFAULT_QUALITY } from "./config";
import { useToast } from "@/hooks/use-toast";

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
   const { toast } = useToast();

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

   const linkRedirect = useMemo(() => {
      if (props.contract.address && props.tokenId !== undefined) {
         const marketplace = process.env.NEXT_PUBLIC_NFT_MARKETPLACE;
         const environment = process.env.NEXT_PUBLIC_NFT_ENVIRONMENT;
         const chain = environment === 'mainnet' ? "avalanche" : "avalanche_fuji";
         return `${marketplace}/assets/${chain}/${props.contract.address}/${Number(props.tokenId)}`;
      }

      return null;
   }, [props.contract.address, props.tokenId]);

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
            toast({
               title: "Error minting NFT!",
               description: err.message,
               variant: "destructive",
            });
         },
         onSuccess: () => {
            toast({
               title: "Minted NFT successfully!",
               description: "Waiting for the confirmation.",
            });
         },
      });
   };

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

   return {
      useCustomAddress,
      isPendingSendTransaction,
      isDisabledMintBtn,
      form,
      isSuccess,
      linkRedirect,
      toast,
      setUseCustomAddress,
      onSubmit,
   };
};
