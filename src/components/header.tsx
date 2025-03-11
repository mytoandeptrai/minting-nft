"use client";

import { wallets } from "@/components/modules/nft-mint/hooks";
import useCheckMobile from "@/hooks/use-mobile";
import { client } from "@/lib/thirdwebClient";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { ConnectButton } from "thirdweb/react";

const Header = () => {
   const isMobile = useCheckMobile();
   return (
      <header className="bg-dark-grey text-white shadow-md sticky top-0 z-50">
         <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center">
               <Link
                  href={process.env.NEXT_PUBLIC_NFT_REDIRECT!}
                  target="_blank"
                  className="flex items-center"
               >
                  <Image
                     src="/logo.svg"
                     alt="logo"
                     width={50}
                     height={50}
                  />
                  <div className="hidden md:block">
                     <Image
                        src="/sub-logo.svg"
                        alt="sub-logo"
                        width={250}
                        height={38}
                     />
                  </div>
               </Link>
            </div>
            <div>
               <ConnectButton
                  wallets={wallets}
                  client={client}
                  connectModal={{
                     showThirdwebBranding: false,
                     title: "Connect to your wallet",
                  }}
                  connectButton={{ style: { height: isMobile ? "40px" : "auto" } }}
               />
            </div>
         </div>
      </header>
   );
};

export default Header;
