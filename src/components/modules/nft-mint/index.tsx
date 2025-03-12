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
      linkRedirect,
      onSubmit,
      toast,
   } = useNftMint(props);

   useEffect(() => {
      if (isSuccess) {
         form.reset();
         toast({
            title: "Confirmed successfully!",
            action: (
               <ToastAction
                  altText="Try again"
                  onClick={() => {
                     if (linkRedirect) {
                        window.open(linkRedirect, "_blank");
                     }
                  }}
                  className="hover:text-white"
               >
                  View NFT
               </ToastAction>
            ),
         });
      }
   }, [isSuccess, form, linkRedirect]);

   return (
      <Form {...form}>
         <form
            className="block"
            onSubmit={form.handleSubmit(onSubmit)}
         >
            <Card className="w-full max-w-md shadow-[rgba(6,_24,_44,_0.4)_0px_0px_0px_2px,_rgba(6,_24,_44,_0.65)_0px_4px_6px_-1px,_rgba(255,_255,_255,_0.08)_0px_1px_0px_inset]">
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
