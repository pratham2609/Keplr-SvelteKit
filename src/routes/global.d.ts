import { Window as KeplrWindow, type Coin } from "@keplr-wallet/types";

declare global {
    interface Window extends KeplrWindow { }
}
export type Reward = {
    validator_address: string;
    reward: Coin[];
};