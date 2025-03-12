import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
   return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
   return amount.toLocaleString("en-US", { maximumFractionDigits: 0 });
}

export function replaceNonAlphanumeric(inputString: string): string {
   return inputString.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}
