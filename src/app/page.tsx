"use client";

import LoadingNftMint from "@/components/loading-nft-mint";
import { NftMint } from "@/components/nft-mint";
import {
   defaultChainId,
   defaultNftContractAddress,
   defaultTokenId,
} from "@/lib/constants";
import { client } from "@/lib/thirdwebClient";
import { defineChain, getContract } from "thirdweb";
import { getContractMetadata } from "thirdweb/extensions/common";
import { getNFT, isERC1155 } from "thirdweb/extensions/erc1155";
import { useReadContract } from "thirdweb/react";

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
      <NftMint
         contract={contract}
         displayName={displayName || ""}
         symbol={contractMetadataQuery.data?.symbol || ""}
         contractImage={contractMetadataQuery.data?.image || ""}
         description={description || ""}
         tokenId={tokenId}
      />
   );
}
