import { CardContent } from "@/components/ui/card";
import {
   FormControl,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { nftMintSchema } from "@/schemas";
import React from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { ThirdwebContract } from "thirdweb";
import { NFT } from "thirdweb/react";
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

const NftMintContentHeader = (props: Props) => {
   const { control } = useFormContext<z.infer<typeof nftMintSchema>>();

   const useCustomAddress = useWatch({
      control,
      name: "useCustomAddress",
   });

   return (
      <>
         <div className="aspect-square overflow-hidden rounded-lg mb-4 relative">
            <NFT
               contract={props.contract}
               tokenId={props.tokenId}
            >
               <React.Suspense
                  fallback={<Skeleton className="w-full h-full object-cover" />}
               >
                  <NFT.Media className="w-full h-full object-cover" />
               </React.Suspense>
            </NFT>
         </div>
         <h2 className="text-2xl font-bold mb-2 dark:text-white">
            {props.displayName}
         </h2>
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
      </>
   );
};

const NftMintContent = (props: Props) => {
   const { isPendingSendTransaction } = props;

   const { control } = useFormContext<z.infer<typeof nftMintSchema>>();
   const useCustomAddress = useWatch({
      control,
      name: "useCustomAddress",
   });

   return (
      <CardContent className="pt-6">
         <NftMintContentHeader {...props} />
         {useCustomAddress && (
            <div className="mb-4">
               <FormField
                  control={control}
                  name="customAddress"
                  render={({ field }) => (
                     <FormItem>
                        <FormControl>
                           <Input
                              {...field}
                              id="address-input"
                              type="text"
                              placeholder="Enter recipient address"
                              className="w-full"
                              disabled={isPendingSendTransaction}
                           />
                        </FormControl>
                        <FormMessage />
                     </FormItem>
                  )}
               />
            </div>
         )}
      </CardContent>
   );
};

export default NftMintContent;
