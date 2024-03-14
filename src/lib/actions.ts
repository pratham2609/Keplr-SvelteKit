import { chainDataState, globalState } from '$lib/stores/walletStore';
import { type AccountData, type OfflineSigner } from '@cosmjs/proto-signing';
import { SigningStargateClient } from '@cosmjs/stargate';
import axios from 'axios';
import { get } from 'svelte/store';
export const getBalance = async () => {
    const { keplr } = window;
    const chainData = get(chainDataState);
    if (!keplr) {
        alert('You need to install Keplr');
        return;
    }
    await keplr.experimentalSuggestChain(chainData); // injects non native chains
    // Create the signing client
    const offlineSigner: OfflineSigner = window.getOfflineSigner!(chainData.chainId);
    const signingClient = await SigningStargateClient.connectWithSigner(chainData.rpc, offlineSigner);
    // Get the address and balance of your user
    const account: AccountData = (await offlineSigner.getAccounts())[0];
    const myBalance = (await signingClient.getBalance(account.address, get(globalState).denom)).amount;
    globalState.update((localState) => {
        const newState = { ...localState, myAddress: account.address, myBalance: myBalance };
        return newState;
    });
    // const valData = await getValidators(chainData.chainName);
    // validators.update(() => {
    //     return valData;
    // });
}

export const getValidators = async (chain: string) => {
    const data = await axios.get(`https://validators.testcosmos.directory/chains/${chain}`);
    return data.data.validators;
}