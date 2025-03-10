"use client";

import LoadingNftMint from "@/components/loading-nft-mint";
import NftMint from "@/components/modules/nft-mint";
import { wallets } from "@/components/modules/nft-mint/hooks";
import {
   defaultChainId,
   defaultNftContractAddress,
   defaultTokenId,
} from "@/lib/constants";
import { client } from "@/lib/thirdwebClient";
import Image from "next/image";
import Link from "next/link";
import { defineChain, getContract } from "thirdweb";
import { getContractMetadata } from "thirdweb/extensions/common";
import { getNFT, isERC1155 } from "thirdweb/extensions/erc1155";
import { ConnectButton, useReadContract } from "thirdweb/react";

export default function Home() {
   const tokenId = defaultTokenId;
   const chain = defineChain(defaultChainId);
   const contract = getContract({
      address: defaultNftContractAddress,
      chain,
      client,
   });
   const isERC1155Query = useReadContract(isERC1155, { contract });
   const contractMetadataQuery = useReadContract(getContractMetadata, {
      contract,
   });

   const nftQuery = useReadContract(getNFT, {
      contract,
      tokenId,
      queryOptions: { enabled: isERC1155Query.data },
   });

   const displayName = isERC1155Query.data
      ? nftQuery.data?.metadata.name
      : contractMetadataQuery.data?.name;

   const description = isERC1155Query.data
      ? nftQuery.data?.metadata.description
      : contractMetadataQuery.data?.description;

   const loading = nftQuery?.isLoading ?? false;

   if (loading) {
      return <LoadingNftMint />;
   }

   return (
      <div className="flex flex-col min-h-screen transition-colors duration-200">
         <header className="bg-gray-900 text-white shadow-md sticky top-0 z-50">
            <div className="container mx-auto px-4 py-4 flex items-center justify-between">
               <Link
                  href="/"
                  className="flex items-center"
               >
                  <Image
                     src="/logo.png"
                     alt="logo"
                     width={50}
                     height={50}
                  />
               </Link>
               <div>
                  <ConnectButton
                     wallets={wallets}
                     client={client}
                     connectModal={{
                        showThirdwebBranding: false,
                        title: "Connect to your wallet",
                     }}
                  />
               </div>
            </div>
         </header>
         <div className="h-full flex-1 w-full flex items-center justify-center bg-gray-100 dark:bg-gray-950">
            <NftMint
               contract={contract}
               displayName={displayName || ""}
               symbol={contractMetadataQuery.data?.symbol || ""}
               contractImage={contractMetadataQuery.data?.image || ""}
               description={description || ""}
               tokenId={tokenId}
            />
         </div>
      </div>
   );
}
