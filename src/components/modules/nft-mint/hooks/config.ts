import { createWallet, inAppWallet } from "thirdweb/wallets";

export const wallets = [
   createWallet("io.metamask"),
   createWallet("com.coinbase.wallet"),
   createWallet("me.rainbow"),
   createWallet("io.zerion.wallet"),
];

export const DEFAULT_QUALITY = 1;
