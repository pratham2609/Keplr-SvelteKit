import type { ChainInfo } from "@keplr-wallet/types";
import { writable, type Writable } from "svelte/store";

export const transactionMode: Writable<string> = writable("Send");
// test faucet = cosmos15aptdqmm7ddgtcrjvc5hs988rlrkze40l4q0he
export const getTestnetChainInfo: ChainInfo[] = [
    {
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
    },
    {
        chainId: 'test-core-1',
        chainName: 'persistencetestnet',
        rpc: 'https://persistence-testnet-rpc.polkachu.com/',
        rest: 'https://persistence-testnet-api.polkachu.com/',
        bip44: {
            coinType: 118
        },
        bech32Config: {
            bech32PrefixAccAddr: 'persistence',
            bech32PrefixAccPub: 'persistence' + 'pub',
            bech32PrefixValAddr: 'persistence' + 'valoper',
            bech32PrefixValPub: 'persistence' + 'valoperpub',
            bech32PrefixConsAddr: 'persistence' + 'valcons',
            bech32PrefixConsPub: 'persistence' + 'valconspub'
        },
        currencies: [
            {
                coinDenom: 'XPRT',
                coinMinimalDenom: 'uxprt',
                coinDecimals: 6,
                coinGeckoId: 'persistence'
            },
            {
                coinDenom: 'THETA',
                coinMinimalDenom: 'theta',
                coinDecimals: 0
            }
        ],
        feeCurrencies: [
            {
                coinDenom: 'XPRT',
                coinMinimalDenom: 'uxprt',
                coinDecimals: 6,
                coinGeckoId: 'persistence'
            }
        ],
        stakeCurrency: {
            coinDenom: 'XPRT',
            coinMinimalDenom: 'uxprt',
            coinDecimals: 6,
            coinGeckoId: 'persistence'
        },
        coinType: 118,
        features: ['stargate', 'ibc-transfer', 'no-legacy-stdTx']
    },
    {
        chainId: 'osmo-test-5',
        chainName: 'osmosistestnet',
        rpc: 'https://rpc.osmotest5.osmosis.zone/',
        rest: 'https://lcd.osmotest5.osmosis.zone/',
        bip44: {
            coinType: 118
        },
        bech32Config: {
            bech32PrefixAccAddr: 'osmo',
            bech32PrefixAccPub: 'osmo' + 'pub',
            bech32PrefixValAddr: 'osmo' + 'valoper',
            bech32PrefixValPub: 'osmo' + 'valoperpub',
            bech32PrefixConsAddr: 'osmo' + 'valcons',
            bech32PrefixConsPub: 'osmo' + 'valconspub'
        },
        currencies: [
            {
                coinDenom: 'OSMO',
                coinMinimalDenom: 'uosmo',
                coinDecimals: 6,
                coinGeckoId: 'osmosis'
            },
            {
                coinDenom: 'THETA',
                coinMinimalDenom: 'theta',
                coinDecimals: 0
            }
        ],
        feeCurrencies: [
            {
                coinDenom: 'OSMO',
                coinMinimalDenom: 'uosmo',
                coinDecimals: 6,
                coinGeckoId: 'osmosis'
            }
        ],
        stakeCurrency: {
            coinDenom: 'OSMO',
            coinMinimalDenom: 'uosmo',
            coinDecimals: 6,
            coinGeckoId: 'osmosis'
        },
        coinType: 118,
        features: ['stargate', 'ibc-transfer', 'no-legacy-stdTx']
    }
]
