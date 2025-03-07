"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { client } from "@/lib/thirdwebClient";
import { Minus, Plus } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { type ThirdwebContract } from "thirdweb";
import {
   ConnectButton,
   NFT,
   useActiveAccount,
   useActiveWalletChain,
   useReadContract,
   useSendTransaction,
   useSwitchActiveWalletChain,
   useWaitForReceipt,
} from "thirdweb/react";
import { Skeleton } from "./ui/skeleton";
import { claimTo } from "thirdweb/extensions/erc1155";
import { createWallet, inAppWallet } from "thirdweb/wallets";

type Props = {
   contract: ThirdwebContract;
   displayName: string;
   description: string;
   contractImage: string;
   tokenId: bigint;
   symbol: string;
};

const useNftMint = (props: Props) => {
   const contract = props.contract;
   const [quantity, setQuantity] = useState(1);
   const [useCustomAddress, setUseCustomAddress] = useState(false);
   const [customAddress, setCustomAddress] = useState("");

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

   const decreaseQuantity = () => {
      setQuantity((prev) => Math.max(1, prev - 1));
   };

   const increaseQuantity = () => {
      setQuantity((prev) => prev + 1);
   };

   const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = Number.parseInt(e.target.value);
      if (!Number.isNaN(value)) {
         setQuantity(Math.min(Math.max(1, value)));
      }
   };

   const { data: tokenURI, isPending } = useReadContract({
      contract,
      method: "function uri(uint256 _tokenId) view returns (string)",
      params: [BigInt(props.tokenId)],
   });

   const onMintNftToken = async () => {
      if (!account || !account?.address) {
         return;
      }
      const address = customAddress || account?.address!;
      const transaction = claimTo({
         contract,
         to: address,
         quantity: BigInt(quantity),
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

   useEffect(() => {
      if (isSuccess) {
         toast.success("Minted successfully!");
         setQuantity(1);
         setCustomAddress("");
      }
   }, [isSuccess]);

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

   const isDisabledMintBtn =
      isPending ||
      isPendingSendTransaction ||
      isLoading ||
      (useCustomAddress && !customAddress);
   const isDisabledInput = isPending || isPendingSendTransaction || isLoading;

   return {
      quantity,
      useCustomAddress,
      customAddress,
      account,
      isPendingSendTransaction,
      isDisabledMintBtn,
      isDisabledInput,
      decreaseQuantity,
      increaseQuantity,
      handleQuantityChange,
      setUseCustomAddress,
      setCustomAddress,
      onMintNftToken,
   };
};

const wallets = [
   inAppWallet({
      auth: {
         options: [],
      },
   }),
   createWallet("io.metamask"),
   createWallet("com.coinbase.wallet"),
   createWallet("me.rainbow"),
   createWallet("io.zerion.wallet"),
];

export function NftMint(props: Props) {
   const {
      quantity,
      useCustomAddress,
      customAddress,
      account,
      isPendingSendTransaction,
      isDisabledMintBtn,
      isDisabledInput,
      decreaseQuantity,
      increaseQuantity,
      handleQuantityChange,
      setUseCustomAddress,
      setCustomAddress,
      onMintNftToken,
   } = useNftMint(props);

   return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
         <div className="absolute top-4 right-4">
            <ConnectButton
               wallets={wallets}
               client={client}
            />
         </div>
         <Card className="w-full max-w-md">
            <CardContent className="pt-6">
               <div className="aspect-square overflow-hidden rounded-lg mb-4 relative">
                  <NFT
                     contract={props.contract}
                     tokenId={props.tokenId}
                  >
                     <React.Suspense
                        fallback={
                           <Skeleton className="w-full h-full object-cover" />
                        }
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
               <div className="flex items-center justify-center mb-4 w-full">
                  <Button
                     variant="outline"
                     size="icon"
                     onClick={decreaseQuantity}
                     disabled={quantity <= 1}
                     aria-label="Decrease quantity"
                     className="rounded-r-none"
                  >
                     <Minus className="h-4 w-4" />
                  </Button>
                  <Input
                     type="number"
                     value={quantity}
                     onChange={handleQuantityChange}
                     className="w-28 text-center rounded-none border-x-0 pl-6"
                     min="1"
                     disabled={isDisabledInput}
                  />
                  <Button
                     variant="outline"
                     size="icon"
                     onClick={increaseQuantity}
                     aria-label="Increase quantity"
                     className="rounded-l-none"
                  >
                     <Plus className="h-4 w-4" />
                  </Button>
               </div>

               <div className="flex items-center space-x-2 mb-4">
                  <Switch
                     id="custom-address"
                     checked={useCustomAddress}
                     onCheckedChange={setUseCustomAddress}
                  />
                  <Label
                     htmlFor="custom-address"
                     className={`${
                        useCustomAddress ? "" : "text-gray-400"
                     } cursor-pointer`}
                  >
                     Mint to a custom address
                  </Label>
               </div>
               {useCustomAddress && (
                  <div className="mb-4">
                     <Input
                        id="address-input"
                        type="text"
                        placeholder="Enter recipient address"
                        value={customAddress}
                        onChange={(e) => setCustomAddress(e.target.value)}
                        className="w-full"
                        disabled={isPendingSendTransaction}
                     />
                  </div>
               )}
            </CardContent>
            <CardFooter>
               {account ? (
                  <div className="flex flex-col gap-y-2 w-full">
                     <Button
                        onClick={onMintNftToken}
                        className="bg-black text-white w-full"
                        disabled={isDisabledMintBtn}
                     >
                        Mint {quantity} NFT{quantity > 1 ? "s" : ""}
                     </Button>
                  </div>
               ) : (
                  <ConnectButton
                     client={client}
                     connectButton={{ style: { width: "100%" } }}
                     wallets={wallets}
                  />
               )}
            </CardFooter>
         </Card>
      </div>
   );
}
