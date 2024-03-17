import type { ChainInfo } from "@keplr-wallet/types";
import { writable, type Writable } from "svelte/store";

export const transactionMode: Writable<string> = writable("Send");
// test faucet = cosmos15aptdqmm7ddgtcrjvc5hs988rlrkze40l4q0he
export interface ChainDataInfo extends ChainInfo {
    explorers: {
        kind: string,
        url: string,
        tx_page: string,
        account_page?: string
    }[],
    secName: string,
    fee: {
        denom: string;
        fixed_min_gas_price: number;
        low_gas_price: number;
        average_gas_price: number;
        high_gas_price: number;
    }[]
}
export const getTestnetChainInfo: ChainDataInfo[] = [
    {
        chainId: 'theta-testnet-001',
        chainName: 'cosmoshubtestnet',
        secName: "cosmoshub",
        rpc: 'https://rpc.sentry-01.theta-testnet.polypore.xyz/',
        rest: 'https://rest.sentry-01.theta-testnet.polypore.xyz/',
        bip44: {
            coinType: 118
        },
        fee: [{
            denom: "uatom",
            fixed_min_gas_price: 0.005,
            low_gas_price: 0.01,
            average_gas_price: 0.025,
            high_gas_price: 0.03
        }],
        explorers: [
            {
                kind: "mintscan",
                url: "https://testnet.mintscan.io/cosmoshub-testnet",
                tx_page: "https://testnet.mintscan.io/cosmoshub-testnet/txs/"
            },
            {
                kind: "Big Dipper",
                url: "https://explorer.theta-testnet.polypore.xyz/",
                tx_page: "https://explorer.theta-testnet.polypore.xyz/transactions/"
            }
        ],
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
        chainName: 'persistencetestnet2',
        secName: "persistence",
        rpc: 'https://persistence-testnet-rpc.polkachu.com/',
        rest: 'https://persistence-testnet-api.polkachu.com/',
        bip44: {
            coinType: 118
        },
        fee: [
            {
                denom: "uxprt",
                fixed_min_gas_price: 0,
                low_gas_price: 0.05,
                average_gas_price: 0.125,
                high_gas_price: 0.2
            }
        ],
        explorers: [
            {
                kind: "ping.pub",
                url: "https://testnet.ping.pub/test-core-1/",
                tx_page: "https://testnet.ping.pub/test-core-1/tx/"
            },
            {
                kind: "mintscan",
                url: "https://testnet.mintscan.io/persistence-testnet",
                tx_page: "https://testnet.mintscan.io/persistence-testnet/txs/",
                account_page: "https://testnet.mintscan.io/persistence-testnet/account/"
            }
        ],
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
        secName: "osmosis",
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
        fee: [
            {
                denom: "uosmo",
                fixed_min_gas_price: 0,
                low_gas_price: 0.0025,
                average_gas_price: 0.025,
                high_gas_price: 0.04
            }
        ],
        explorers: [
            {
                kind: "mintscan",
                url: "https://testnet.mintscan.io/osmosis-testnet",
                tx_page: "https://testnet.mintscan.io/osmosis-testnet/txs/",
                account_page: "https://testnet.mintscan.io/osmosis-testnet/account/"
            },
            {
                kind: "ping.pub",
                url: "https://explorer.osmotest5.osmosis.zone",
                tx_page: "https://explorer.osmotest5.osmosis.zone/osmo-test-5/tx/",
                account_page: "https://explorer.osmotest5.osmosis.zone/osmo-test-5/account/"
            }
        ],
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
    },
    {
        chainId: 'mocha-4',
        chainName: 'celestiatestnet3',
        secName: "celestia",
        rpc: 'https://celestia-testnet-rpc.publicnode.com/',
        rest: 'https://api-mocha.pops.one',
        bip44: {
            coinType: 118
        },
        fee: [
            {
                denom: "utia",
                fixed_min_gas_price: 0,
                low_gas_price: 0.01,
                average_gas_price: 0.02,
                high_gas_price: 0.1
            }
        ],
        explorers: [
            {
                kind: "mintscan",
                url: "https://testnet.mintscan.io/celestia-testnet",
                tx_page: "https://testnet.mintscan.io/celestia-testnet/txs/"
            }
        ],
        bech32Config: {
            bech32PrefixAccAddr: 'celestia',
            bech32PrefixAccPub: 'celestiapub',
            bech32PrefixValAddr: 'celestiavaloper',
            bech32PrefixValPub: 'celestiavaloperpub',
            bech32PrefixConsAddr: 'celestiavalcons',
            bech32PrefixConsPub: 'celestiavalconspub'
        },
        currencies: [
            {
                coinDenom: 'TIA',
                coinMinimalDenom: 'utia',
                coinDecimals: 6,
                // coinGeckoId: null
            }
        ],
        feeCurrencies: [
            {
                coinDenom: 'TIA',
                coinMinimalDenom: 'utia',
                coinDecimals: 6,
                // coinGeckoId: null
            }
        ],
        stakeCurrency: {
            coinDenom: 'TIA',
            coinMinimalDenom: 'utia',
            coinDecimals: 6,
            // coinGeckoId: null
        },
        coinType: 118,
        features: []
    }
]
