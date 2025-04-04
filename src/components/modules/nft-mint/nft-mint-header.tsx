import {
   FormControl,
   FormField,
   FormItem,
   FormMessage,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { cn, formatCurrency, replaceNonAlphanumeric } from "@/lib/utils";
import { nftMintSchema } from "@/schemas";
import Link from "next/link";
import React, { useCallback, useEffect, useState } from "react";
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

const initialContractInfo = {
   name: "",
   linkRedirect: "",
};

const NftMintHeader = (props: Props) => {
   const { control } = useFormContext<z.infer<typeof nftMintSchema>>();
   const [contractInfo, setContractInfo] = useState(initialContractInfo);

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

   const onRequestHandler = useCallback(async (contract: string) => {
      try {
         const environment = process.env.NEXT_PUBLIC_NFT_ENVIRONMENT;
         const chain =
            environment === "mainnet" ? "avalanche" : "avalanche_fuji";
         const url = `${process.env.NEXT_PUBLIC_OPEN_SEA_API}/chain/${chain}/contract/${contract}`;
         const openSeaAPIKey = process.env.NEXT_PUBLIC_OPEN_SEA_API_KEY;

         const headers: Record<string, string> = openSeaAPIKey
            ? { accept: "application/json", "x-api-key": openSeaAPIKey }
            : {};

         const response = await fetch(url, {
            headers: headers,
            method: "GET",
         });
         return await response.json();
      } catch (error) {
         return null;
      }
   }, []);

   useEffect(() => {
      (async () => {
         const contract = process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS!;
         if (!contract) return;
         const response = await onRequestHandler(contract);
         if (response) {
            setContractInfo({
               name: response?.name || "",
               linkRedirect: `${process.env
                  .NEXT_PUBLIC_NFT_MARKETPLACE!}/collection/${
                  response?.collection
               }`,
            });
         }
      })();
   }, []);

   return (
      <>
         <div className="aspect-square overflow-hidden rounded-lg">
            <NFT
               contract={props.contract}
               tokenId={props.tokenId}
            >
               <React.Suspense
                  fallback={
                     <Skeleton className="w-full h-full object-cover rounded-lg -mt-14" />
                  }
               >
                  <NFT.Media className="w-full h-full object-cover rounded-lg -mt-14" />
               </React.Suspense>
            </NFT>
         </div>
         <div className="-mt-12">
            <div className="flex flex-col items-center w-full">
               <p className="text-center font-semibold text-lg text-red-500 my-4">FORGE ESSENCE Mint is now closed</p>
            </div>
            <h2 className="text-2xl font-bold mb-2 dark:bg-gradient-to-b dark:from-[#FFB931] dark:to-[#FF7A00] inline-block dark:text-transparent dark:bg-clip-text">
               {props.displayName}
            </h2>
            <p className="text-lg font-semibold mb-1">
               Marketplace:{" "}
               <Link
                  className="underline font-normal"
                  href={contractInfo?.linkRedirect || "/"}
                  target="_blank"
               >
                  {process.env.NEXT_PUBLIC_NFT_COLLECTION_MARKETPLACE_NAME ?? "OpenSea"}
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
            {/* <div className="flex items-center space-x-2 mb-4">
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
            </div> */}
         </div>
      </>
   );
};

export default NftMintHeader;
