import Image from "next/image";
import Link from "next/link";
import React from "react";

const Footer = () => {
   return (
      <div className="w-full flex justify-end p-4 dark:bg-dark-grey">
         <Link className="block" href={process.env.NEXT_PUBLIC_AVALANCHE_REDIRECT!} target="_blank">
            <Image
               src="/avalanche-logo.svg"
               alt="avalanche-logo"
               width={150}
               height={50}
               className="w-32"
            />
         </Link>
      </div>
   );
};

export default Footer;
