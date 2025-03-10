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
   const { account, disabled } = useMintNftActions(props);

   return (
      <CardFooter>
         {account ? (
            <div className="flex flex-col gap-y-2 w-full">
               <Button
                  type="submit"
                  className="bg-black text-white w-full"
                  disabled={disabled}
               >
                  Mint NFT
               </Button>
            </div>
         ) : (
            <ConnectButton
               client={client}
               connectButton={{ style: { width: "100%" } }}
               wallets={wallets}
               connectModal={{
                  showThirdwebBranding: false,
                  title: 'Connect to your wallet'
               }}
            />
         )}
      </CardFooter>
   );
};

export default NftMintActions;
