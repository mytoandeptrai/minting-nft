import {
   FormControl,
   FormField,
   FormItem,
   FormMessage,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { cn, formatCurrency } from "@/lib/utils";
import { nftMintSchema } from "@/schemas";
import Link from "next/link";
import React from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { ThirdwebContract } from "thirdweb";
import { NFT, useReadContract } from "thirdweb/react";
import { z } from "zod";

type Props = {
   contract: ThirdwebContract;
   displayName: string;
   description: string;
   contractImage: string;
   tokenId: bigint;
   symbol: string;
   isPendingSendTransaction: boolean;
};

const NftMintHeader = (props: Props) => {
   const { control } = useFormContext<z.infer<typeof nftMintSchema>>();

   const useCustomAddress = useWatch({
      control,
      name: "useCustomAddress",
   });

   const { data: balanceData } = useReadContract({
      contract: props.contract,
      method: "function totalSupply(uint256) view returns (uint256)",
      params: [BigInt(props.tokenId)],
      queryOptions: {
         enabled: props.tokenId !== undefined && !!String(props.tokenId),
      },
   });

   return (
      <>
         <div className="aspect-square overflow-hidden rounded-lg">
            <NFT
               contract={props.contract}
               tokenId={props.tokenId}
            >
               <React.Suspense
               fallback={<Skeleton className="w-full h-full object-cover rounded-lg -mt-14" />}
               >
               <NFT.Media className="w-full h-full object-cover rounded-lg -mt-14" />
               </React.Suspense>
            </NFT>
         </div>
         <div className="-mt-12">
            <h2 className="text-2xl font-bold mb-2 dark:bg-gradient-to-b dark:from-[#FFB931] dark:to-[#FF7A00] inline-block dark:text-transparent dark:bg-clip-text">
               {props.displayName}
            </h2>
            <p className="text-lg font-semibold mb-1">
               Marketplace:{" "}
               <Link
                  className="underline font-normal"
                  href={process.env.NEXT_PUBLIC_NFT_COLLECTION_MARKETPLACE_URL || "https://salvor.io"}
                  target="_blank"
               >
                  {process.env.NEXT_PUBLIC_NFT_COLLECTION_MARKETPLACE_NAME || "Salvor"}
               </Link>
            </p>
            <p className="text-lg font-semibold mb-1">
               Collection:{" "}
               <span className="font-normal">
                  {formatCurrency(Number(balanceData ?? 0))} Essence Minted
               </span>
            </p>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
               {props.description}
            </p>
            <div className="flex items-center space-x-2 mb-4">
               <FormField
                  control={control}
                  name="useCustomAddress"
                  render={({ field }) => (
                     <FormItem>
                        <FormControl>
                           <Switch
                              name={field.name}
                              id={field.name}
                              checked={field.value}
                              onCheckedChange={field.onChange}
                           />
                        </FormControl>
                        <FormMessage />
                     </FormItem>
                  )}
               />
               <Label
                  htmlFor="custom-address"
                  className={cn("cursor-pointer", {
                     "text-gray-400": useCustomAddress,
                  })}
               >
                  Mint to a custom address
               </Label>
            </div>
         </div>
      </>
   );
};

export default NftMintHeader;
