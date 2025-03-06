"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";

export default function NotFound() {
   const router = useRouter();

   const handleBackHome = () => {
      router.push("/");
   };

   return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
         <Card className="w-full max-w-md">
            <CardContent className="text-center py-10">
               <h2 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
                  404
               </h2>
               <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
                  Oops! The page you're looking for doesn't exist.
               </p>
               <Button
                  onClick={handleBackHome}
                  className="bg-black text-white w-full py-2"
               >
                  Go Back to Home
               </Button>
            </CardContent>
         </Card>
      </div>
   );
}
