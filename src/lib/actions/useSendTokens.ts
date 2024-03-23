import { chainDataState } from "$lib/stores/walletStore";
import { assertIsDeliverTxSuccess, SigningStargateClient, type MsgSendEncodeObject, GasPrice } from "@cosmjs/stargate";
import toast from "svelte-french-toast";
import { get } from "svelte/store";
import { type OfflineSigner } from '@cosmjs/proto-signing';
import { createMutation, useQueryClient } from "@tanstack/svelte-query";
import { simulateAndGetFees } from "./getFees";
// import { simulateAndGetFees } from "./getFees";

type Payload = {
    toAddress: string,
    myAddress: string,
    denom: string,
    sendAmount: string,
    memo: string
}
function onSendClicked(
) {
    const queryClient = useQueryClient();
    async function mutateVal({ toAddress, myAddress, denom, sendAmount, memo }: Payload) {
        console.log(sendAmount)
        if (!toAddress.includes(get(chainDataState).bech32Config.bech32PrefixAccAddr)) {
            toast.error(`Please provide address of ${get(chainDataState).chainName} chain`);
        }
        toast.loading('Sending tokens', { duration: 1000 });
        const offlineSigner: OfflineSigner = window.getOfflineSigner!(get(chainDataState).chainId);
        const signingClient = await SigningStargateClient.connectWithSigner(
            get(chainDataState).rpc,
            offlineSigner
        );
        const sendMsg: MsgSendEncodeObject = {
            typeUrl: '/cosmos.bank.v1beta1.MsgSend',
            value: {
                fromAddress: myAddress,
                toAddress: toAddress,
                amount: [{ denom, amount: sendAmount }]
            }
        };

        const getFees = await simulateAndGetFees([sendMsg], memo);
        const sendResult = await signingClient.signAndBroadcast(
            myAddress,
            [sendMsg],
            getFees,
            // { amount: [{ denom: denom, amount: '500' }], gas: '200000' },
            memo
        );
        const txHash = sendResult.transactionHash;
        assertIsDeliverTxSuccess(sendResult);
        return txHash;
    }
    return createMutation({
        mutationFn: mutateVal,
        onSuccess: (data, payload) => {
            console.log(data, payload)
            // balane
            queryClient.invalidateQueries({
                queryKey: ["userBalance"],
                refetchType: 'all',
            });
        },
    })
}
export default onSendClicked;