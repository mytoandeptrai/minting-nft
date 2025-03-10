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
   const { control } = useFormContext<z.infer<typeof nftMintSchema>>();
   const [useCustomAddress, customAddress] = useWatch({
      control,
      name: ["useCustomAddress", "customAddress"],
   });

   const account = useActiveAccount();
   const { data: balanceData } = useReadContract({
      contract,
      method:
         "function balanceOf(address owner, uint256 id) view returns (uint256)",
      params: [account?.address!, BigInt(tokenId)],
      queryOptions: {
         enabled: !!account?.address,
      },
   });

   const disabled = useMemo(() => {
      if (!balanceData) {
         return isDisabled;
      }

      if (useCustomAddress && !customAddress) return true;

      return Number(balanceData) > 0;
   }, []);

   return {
      ...props,
      account,
      disabled,
   };
};
