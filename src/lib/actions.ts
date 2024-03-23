import { chainDataState, globalState, type InitialValidatorState, isWalletInitialised } from '$lib/stores/walletStore';
import { type AccountData, type OfflineSigner } from '@cosmjs/proto-signing';
import { SigningStargateClient, calculateFee, type MsgDelegateEncodeObject, assertIsDeliverTxSuccess } from '@cosmjs/stargate';
import axios from 'axios';
import { get } from 'svelte/store';
import { MsgWithdrawDelegatorReward } from "cosmjs-types/cosmos/distribution/v1beta1/tx";
import { MsgDelegate } from 'cosmjs-types/cosmos/staking/v1beta1/tx';
export const connectWallet = async () => {
    // Suggest the testnet chain to Keplr
    const { keplr } = window;
    if (!keplr) {
        alert('You need to install Keplr');
        return;
    }
    await keplr.enable(get(chainDataState).chainId);
    const chainData = get(chainDataState);
    await keplr.experimentalSuggestChain(chainData); // injects non native chains
    // Create the signing client
    const offlineSigner: OfflineSigner = window.getOfflineSigner!(chainData.chainId);
    // Get the address and balance of your user
    const account: AccountData = (await offlineSigner.getAccounts())[0];
    const myAddress = account.address;
    globalState.update((localState) => {
        const newState = {
            ...localState,
            denom: chainData.currencies[0].coinMinimalDenom,
            myAddress: myAddress,
        };
        return newState;
    });
    isWalletInitialised.set("connected")
};

export const getValidators = async () => {
    const data = await axios.get(`https://validators.testcosmos.directory/chains/${get(chainDataState).chainName}`);
    const val: InitialValidatorState[] = data.data.validators.sort((a: InitialValidatorState, b: InitialValidatorState) => a.rank - b.rank);
    return val;
}


export const getRewards = async () => {
    const data = await axios.get(`
		https://rest.testcosmos.directory/${get(chainDataState).chainName}/cosmos/distribution/v1beta1/delegators/${get(globalState).myAddress}/rewards`);
    console.log(data)
    return data;
}



export const withdrawRewards = async (validator_address: string) => {
    const { keplr } = window;
    const chainData = get(chainDataState);
    if (!keplr) {
        alert('You need to install Keplr');
        return;
    }
    await keplr.enable(chainData.chainId);
    const offlineSigner: OfflineSigner = window.getOfflineSigner!(chainData.chainId);
    const signingClient = await SigningStargateClient.connectWithSigner(chainData.rpc, offlineSigner);
    const messages = [{
        typeUrl: "/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward",
        value: MsgWithdrawDelegatorReward.fromPartial({
            delegatorAddress: get(globalState).myAddress,
            validatorAddress: validator_address
        })
    }];
    const gasEstimation = await signingClient.simulate(
        get(globalState).myAddress,
        messages,
        get(globalState).memo
    );
    const fee = calculateFee(
        Math.round(gasEstimation * 1.4),
        String(get(chainDataState).fee[0].high_gas_price * 5) + get(chainDataState).fee[0].denom
    );
    const result = await signingClient.signAndBroadcast(get(globalState).myAddress, messages, fee, get(globalState).memo);
    return result;
}

// export const generateFee = async (fee: StdFee | "auto" | number) => {
//     let usedFee: StdFee;
//     const offlineSigner: OfflineSigner = window.getOfflineSigner!(get(chainDataState).chainId);
//     const signingClient = await SigningStargateClient.connectWithSigner(
//         get(chainDataState).rpc,
//         offlineSigner
//     );
//     if (fee == "auto" || typeof fee === "number") {
//         // assertDefined(this.gasPrice, "Gas price must be set in the client options when auto gas is used.");
//         const gasEstimation = await signingClient.simulate(get(globalState).myAddress, messages, get(globalState).memo);
//         const multiplier = typeof fee === "number" ? fee : 1.3;
//         usedFee = calculateFee(Math.round(gasEstimation * multiplier), gasPrice);
//     } else {
//         usedFee = fee;
//     }
//     return usedFee;
// }

export const getBalance = async () => {
    let myBalance = "0";
    const state = get(globalState)
    if (get(isWalletInitialised) === "connected" && state.myAddress !== "Loading...") {
        const { keplr } = window;
        if (!keplr) {
            alert('You need to install Keplr');
            return;
        }
        const chainData = get(chainDataState);
        keplr.enable(chainData.chainId)
        await keplr.experimentalSuggestChain(chainData); // injects non native chains
        // Create the signing client
        const offlineSigner: OfflineSigner = window.getOfflineSigner!(chainData.chainId);
        const signingClient = await SigningStargateClient.connectWithSigner(
            chainData.rpc,
            offlineSigner
        );
        // Get the address and balance of your user
        const account: AccountData = (await offlineSigner.getAccounts())[0];
        myBalance = (
            await signingClient.getBalance(
                account.address,
                chainData.currencies[0].coinMinimalDenom
            )
        ).amount;
    }
    return myBalance;
};

export const stake = async ({ myAddress, toAddress, denom, toSend, memo }: {
    myAddress: string,
    toAddress: string,
    denom: string,
    toSend: string,
    memo: string
}) => {
    const chainData = get(chainDataState);
    const offlineSigner: OfflineSigner = window.getOfflineSigner!(chainData.chainId);
    const signingClient = await SigningStargateClient.connectWithSigner(
        chainData.rpc,
        offlineSigner
    );
    const delegateMsg: MsgDelegateEncodeObject = {
        typeUrl: '/cosmos.staking.v1beta1.MsgDelegate',
        value: MsgDelegate.fromPartial({
            delegatorAddress: myAddress,
            validatorAddress: toAddress,
            amount: { denom, amount: toSend }
        })
    };
    const res = await signingClient.signAndBroadcast(
        myAddress,
        [delegateMsg],
        { amount: [{ denom: denom, amount: '500' }], gas: '200000' },
        memo
    );
    globalState.update((lastState) => {
        return {
            ...lastState,
            toSend: '0',
            memo: ''
        };
    });
    assertIsDeliverTxSuccess(res);
    return res.transactionHash
};