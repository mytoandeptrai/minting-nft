"use client";

import NftMintActions from "@/components/modules/nft-mint/nft-mint-actions";
import NftMintContent from "@/components/modules/nft-mint/nft-mint-content";
import { Card } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { type ThirdwebContract } from "thirdweb";
import { useNftMint } from "./hooks";
import { useEffect } from "react";
import { ToastAction } from "@/components/ui/toast";

export type NftMintProps = {
   contract: ThirdwebContract;
   displayName: string;
   description: string;
   contractImage: string;
   tokenId: bigint;
   symbol: string;
};

export default function NftMint(props: NftMintProps) {
   const {
      isPendingSendTransaction,
      isDisabledMintBtn,
      form,
      isSuccess,
      onSubmit,
      toast,
   } = useNftMint(props);

   useEffect(() => {
      if (isSuccess) {
         form.reset();
         toast({
            title: "Confirmed successfully!",
            description: "Click the button beside to view NFT.",
            action: (
               <ToastAction
                  altText="Try again"
                  onClick={() => {
                     const market =
                        process.env.NEXT_PUBLIC_NFT_MARKETPLACE_DETAIL;
                     if (market) {
                        window.open(market, "_blank");
                     }
                  }}
               >
                  View
               </ToastAction>
            ),
         });
      }
   }, [isSuccess, form]);

   return (
      <Form {...form}>
         <form
            className="block"
            onSubmit={form.handleSubmit(onSubmit)}
         >
            <Card className="w-full max-w-md">
               <NftMintContent
                  {...props}
                  isPendingSendTransaction={isPendingSendTransaction}
               />
               <NftMintActions
                  {...props}
                  isDisabled={isDisabledMintBtn}
               />
            </Card>
         </form>
      </Form>
   );
}
