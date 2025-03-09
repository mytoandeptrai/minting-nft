"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { type ThirdwebContract } from "thirdweb";
import { claimTo } from "thirdweb/extensions/erc1155";
import {
   useActiveAccount,
   useActiveWalletChain,
   useReadContract,
   useSendTransaction,
   useSwitchActiveWalletChain,
   useWaitForReceipt,
} from "thirdweb/react";

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

   const { data: balanceData } = useReadContract({
      contract,
      method:
         "function balanceOf(address owner, uint256 id) view returns (uint256)",
      params: [account?.address!, BigInt(props.tokenId)],
      queryOptions: {
         enabled: !!account?.address,
      },
   });
   console.log('🚀 ~ useNftMint ~ balanceData:', balanceData);

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
      isPendingSendTransaction ||
      isLoading ||
      (useCustomAddress && !customAddress);

   return {
      quantity,
      useCustomAddress,
      customAddress,
      account,
      isPendingSendTransaction,
      isDisabledMintBtn,
      setUseCustomAddress,
      setCustomAddress,
      onMintNftToken,
   };
};

export default useNftMint;