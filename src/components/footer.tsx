import Image from "next/image";
import React from "react";

const Footer = () => {
   return (
      <div className="w-full flex justify-end p-4 dark:bg-dark-grey">
         <div>
            <Image
               src="/avalanche-logo.svg"
               alt="avalanche-logo"
               width={150}
               height={50}
            />
         </div>
      </div>
   );
};

export default Footer;
