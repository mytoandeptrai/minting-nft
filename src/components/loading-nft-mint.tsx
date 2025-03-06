"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Minus } from "lucide-react";

export default function LoadingNftMint() {
   return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
         <Card className="w-full max-w-md">
            <CardContent className="pt-6">
               <div className="aspect-square overflow-hidden rounded-lg mb-4 relative">
                  <Skeleton className="w-full h-full" />
               </div>

               <Skeleton className="h-8 w-3/4 mb-2" />
               <Skeleton className="h-4 w-1/2 mb-4" />

               <div className="flex items-center justify-center mb-4 w-full">
                  <Button
                     variant="outline"
                     size="icon"
                     className="rounded-r-none"
                     disabled
                  >
                     <Minus className="h-4 w-4" />
                  </Button>
                  <Skeleton className="h-10 w-28 mx-2" />
                  <Button
                     variant="outline"
                     size="icon"
                     className="rounded-l-none"
                     disabled
                  >
                     <Plus className="h-4 w-4" />
                  </Button>
               </div>

               <Skeleton className="h-4 w-3/4 mb-4" />
            </CardContent>

            <CardFooter>
               <Skeleton className="h-10 w-full" />
            </CardFooter>
         </Card>
      </div>
   );
}
