import { Button } from "@/components/ui/button";
import { CardFooter } from "@/components/ui/card";
import { client } from "@/lib/thirdwebClient";
import { ThirdwebContract } from "thirdweb";
import { ConnectButton } from "thirdweb/react";
import { useMintNftActions, wallets } from "./hooks";

type Props = {
   contract: ThirdwebContract;
   tokenId: bigint;
   isDisabled?: boolean;
};

const NftMintActions = (props: Props) => {
   const { account, disabled, hasMinted } = useMintNftActions(props);

   return (
      <CardFooter>
         {/* {account ? (
            <div className="flex flex-col gap-y-2 w-full">
               <Button
                  type="submit"
                  className="bg-black text-custom-title dark:bg-white dark:hover:bg-primary/90"
                  disabled={disabled}
                  loading={props?.isDisabled}
               >
                  {hasMinted ? "Wallet Limit Reached" : "Mint NFT"} 
               </Button>
            </div>
         ) : (
            <ConnectButton
               client={client}
               connectButton={{ style: { width: "100%" } }}
               wallets={wallets}
               connectModal={{
                  showThirdwebBranding: false,
                  title: "Connect to your wallet",
               }}
            />
         )} */}
          <div className="flex flex-col gap-y-2 w-full">
               <Button
                  type="submit"
                  className="bg-red-500 text-custom-title dark:bg-red-500 dark:hover:bg-red-500 dark:text-white dark:hover:text-white text-white"
                  disabled={true}
               >
                  Mint Closed
               </Button>
         </div>
      </CardFooter>
   );
};

export default NftMintActions;
