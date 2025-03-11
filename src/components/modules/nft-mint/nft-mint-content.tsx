import { CardContent } from "@/components/ui/card";
import {
   FormControl,
   FormField,
   FormItem,
   FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { nftMintSchema } from "@/schemas";
import { useFormContext, useWatch } from "react-hook-form";
import { ThirdwebContract } from "thirdweb";
import { z } from "zod";
import NftMintHeader from "./nft-mint-header";

type Props = {
   contract: ThirdwebContract;
   displayName: string;
   description: string;
   contractImage: string;
   tokenId: bigint;
   symbol: string;
   isPendingSendTransaction: boolean;
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
         <NftMintHeader {...props} />
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
