"use client";

import NftMintActions from "@/components/modules/nft-mint/nft-mint-actions";
import NftMintContent from "@/components/modules/nft-mint/nft-mint-content";
import { Card } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { client } from "@/lib/thirdwebClient";
import { type ThirdwebContract } from "thirdweb";
import { ConnectButton, darkTheme } from "thirdweb/react";
import { useNftMint, wallets } from "./hooks";

export type NftMintProps = {
   contract: ThirdwebContract;
   displayName: string;
   description: string;
   contractImage: string;
   tokenId: bigint;
   symbol: string;
};

export default function NftMint(props: NftMintProps) {
   const { isPendingSendTransaction, isDisabledMintBtn, form, onSubmit } =
      useNftMint(props);

   return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
         <div className="absolute top-4 right-4">
            <ConnectButton
               wallets={wallets}
               client={client}
               connectModal={{
                  showThirdwebBranding: false,
                  title: 'Connect to your wallet'
               }}
            />
         </div>
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
      </div>
   );
}
