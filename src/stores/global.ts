import type { ChainInfo } from "@keplr-wallet/types";
import { writable, type Writable } from "svelte/store";

export const transactionMode: Writable<string> = writable("Send");
export const rpcUrl = 'https://rpc.sentry-01.theta-testnet.polypore.xyz';
// test faucet = cosmos15aptdqmm7ddgtcrjvc5hs988rlrkze40l4q0he
export function getTestnetChainInfo(): ChainInfo {
    return {
        chainId: 'theta-testnet-001',
        chainName: 'theta-testnet-001',
        rpc: 'https://rpc.sentry-01.theta-testnet.polypore.xyz/',
        rest: 'https://rest.sentry-01.theta-testnet.polypore.xyz/',
        bip44: {
            coinType: 118
        },
        bech32Config: {
            bech32PrefixAccAddr: 'cosmos',
            bech32PrefixAccPub: 'cosmos' + 'pub',
            bech32PrefixValAddr: 'cosmos' + 'valoper',
            bech32PrefixValPub: 'cosmos' + 'valoperpub',
            bech32PrefixConsAddr: 'cosmos' + 'valcons',
            bech32PrefixConsPub: 'cosmos' + 'valconspub'
        },
        currencies: [
            {
                coinDenom: 'ATOM',
                coinMinimalDenom: 'uatom',
                coinDecimals: 6,
                coinGeckoId: 'cosmos'
            },
            {
                coinDenom: 'THETA',
                coinMinimalDenom: 'theta',
                coinDecimals: 0
            }
        ],
        feeCurrencies: [
            {
                coinDenom: 'ATOM',
                coinMinimalDenom: 'uatom',
                coinDecimals: 6,
                coinGeckoId: 'cosmos'
            }
        ],
        stakeCurrency: {
            coinDenom: 'ATOM',
            coinMinimalDenom: 'uatom',
            coinDecimals: 6,
            coinGeckoId: 'cosmos'
        },
        coinType: 118,
        features: ['stargate', 'ibc-transfer', 'no-legacy-stdTx']
    };
}
