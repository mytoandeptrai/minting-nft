import { nftMintSchema } from "@/schemas";
import { useMemo } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { ThirdwebContract } from "thirdweb";
import { useActiveAccount, useReadContract } from "thirdweb/react";
import { z } from "zod";

type Props = {
   contract: ThirdwebContract;
   tokenId: bigint;
   isDisabled?: boolean;
};
export const useMintNftActions = (props: Props) => {
   const { contract, tokenId, isDisabled = false } = props;
   const {
      control,
      formState: { errors },
   } = useFormContext<z.infer<typeof nftMintSchema>>();
   const [useCustomAddress, customAddress] = useWatch({
      control,
      name: ["useCustomAddress", "customAddress"],
   });

   const account = useActiveAccount();
   const owner = useCustomAddress ? customAddress! : account?.address!;
   const enabled = useCustomAddress
      ? !!customAddress && !errors?.customAddress
      : !!account?.address;

   const { data: balanceData } = useReadContract({
      contract,
      method:
         "function balanceOf(address owner, uint256 id) view returns (uint256)",
      params: [owner, BigInt(tokenId)],
      queryOptions: {
         enabled,
      },
   });

   const hasMinted = Number(balanceData) > 0;

   const disabled = useMemo(() => {
      if (useCustomAddress && !customAddress) return true;

      if (!balanceData) {
         return isDisabled;
      }

      return isDisabled || hasMinted;
   }, [isDisabled, hasMinted, useCustomAddress, customAddress]);

   return {
      ...props,
      account,
      disabled,
      hasMinted,
   };
};
