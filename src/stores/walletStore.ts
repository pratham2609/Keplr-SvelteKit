// import { setContext } from "svelte";
import { writable, type Writable } from "svelte/store";
export interface State {
    faucetAddress: string;
    denom: string;
    faucetBalance: string;
    myAddress: string;
    myBalance: string;
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
    memo: "Hello from the Theta Faucet!"
};

export const isWalletInitialised = writable(false);
export const globalState: Writable<State> = writable(initialState);
// $: globalState.set

// setContext('global', globalState);