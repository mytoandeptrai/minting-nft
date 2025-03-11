import { useEffect, useState } from "react";

export default function useCheckMobile() {
   const [width, setWidth] = useState(0);
   const handleWindowSizeChange = () => {
      if (typeof window !== "undefined") {
         setWidth(window.innerWidth);
      }
   };

   useEffect(() => {
      handleWindowSizeChange();
   }, []);

   return width <= 768;
}
