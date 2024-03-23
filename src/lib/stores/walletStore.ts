import { writable, type Writable } from "svelte/store";
import { getTestnetChainInfo, type ChainDataInfo } from "./global";
import { browser } from "$app/environment";
import type { Reward } from "../../routes/global";
export interface State {
    faucetAddress: string;
    denom: string;
    faucetBalance: string;
    myAddress: string;
    myBalance: string | undefined;
    toSend: string;
    memo: string
}

export const initialState: State = {
    faucetAddress: '',
    denom: 'denom',
    faucetBalance: '0',
    myAddress: 'Loading...',
    myBalance: 'Loading...',
    toSend: '0',
    memo: ""
};

export interface InitialValidatorState {
    path: string;
    name: string;
    moniker: string;
    identity: string;
    address: string;
    active: boolean;
    hex_address: string;
    operator_address: string;
    consensus_pubkey: {
        "@type": string;
        key: string;
    };
    jailed: boolean;
    status: string;
    tokens: string;
    delegator_shares: string;
    description: {
        moniker: string;
        identity: string;
        website: string;
        security_contact: string;
        details: string;
    };
    unbonding_height: string;
    unbonding_time: string;
    commission: {
        commission_rates: {
            rate: string;
            max_rate: string;
            max_change_rate: string;
        };
        update_time: string;
        rate: number;
    };
    min_self_delegation: string;
    unbonding_on_hold_ref_count: string;
    unbonding_ids: string[];
    validator_bond_shares: string;
    liquid_shares: string;
    rank: number;
    signing_info: {
        address: string;
        start_height: string;
        index_offset: string;
        jailed_until: string;
        tombstoned: boolean;
        missed_blocks_counter: string;
    };
    services: {
        staking_rewards: {
            name: string;
            verified: boolean;
            slug: string;
        };
    };
    mintscan_image: string;
    keybase_image: string;
    delegations: {
        total_tokens: string;
        total_count: number;
        total_tokens_display: number;
        total_usd: number;
    };
    image: string;
    restake: {
        address: string;
        run_time: string[];
        minimum_reward: number;
    };
    uptime: number;
    uptime_periods: {
        blocks: number;
        uptime: number;
    }[];
    missed_blocks: number;
    missed_blocks_periods: {
        blocks: number;
        missed: number;
    }[];
    public_nodes: {
        rpc: {
            address: string;
            provider: string;
        }[];
        rest: {
            address: string;
            provider: string;
        }[];
    };
    private_nodes: {
        rpc: boolean;
        rest: boolean;
    };
}

// Example initial state with empty objects
export const ValidatorState: InitialValidatorState = {
    path: "",
    name: "",
    moniker: "",
    identity: "",
    address: "",
    active: false,
    hex_address: "",
    operator_address: "",
    consensus_pubkey: {
        "@type": "",
        key: ""
    },
    jailed: false,
    status: "",
    tokens: "",
    delegator_shares: "",
    description: {
        moniker: "",
        identity: "",
        website: "",
        security_contact: "",
        details: ""
    },
    unbonding_height: "",
    unbonding_time: "",
    commission: {
        commission_rates: {
            rate: "",
            max_rate: "",
            max_change_rate: ""
        },
        update_time: "",
        rate: 0
    },
    min_self_delegation: "",
    unbonding_on_hold_ref_count: "",
    unbonding_ids: [],
    validator_bond_shares: "",
    liquid_shares: "",
    rank: 0,
    signing_info: {
        address: "",
        start_height: "",
        index_offset: "",
        jailed_until: "",
        tombstoned: false,
        missed_blocks_counter: ""
    },
    services: {
        staking_rewards: {
            name: "",
            verified: false,
            slug: ""
        }
    },
    mintscan_image: "",
    keybase_image: "",
    delegations: {
        total_tokens: "",
        total_count: 0,
        total_tokens_display: 0,
        total_usd: 0
    },
    image: "",
    restake: {
        address: "",
        run_time: [],
        minimum_reward: 0
    },
    uptime: 0,
    uptime_periods: [],
    missed_blocks: 0,
    missed_blocks_periods: [],
    public_nodes: {
        rpc: [],
        rest: []
    },
    private_nodes: {
        rpc: false,
        rest: false
    }
};
const initialValue = browser ? window.localStorage.getItem('connect') ?? JSON.stringify(window.localStorage.getItem('connect')) : "not-connected";
export const isWalletInitialised = writable<string>(initialValue);
isWalletInitialised.subscribe(value => {
    if (browser) {
        window.localStorage.setItem('connect', value);
    }
})


export const globalState: Writable<State> = writable(initialState);
export const chainDataState: Writable<ChainDataInfo> = writable(getTestnetChainInfo[0])
export const validators: Writable<InitialValidatorState[]> = writable([]);
export const rewards: Writable<Reward[]> = writable([])