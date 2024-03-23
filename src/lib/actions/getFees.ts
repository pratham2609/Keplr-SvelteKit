import { GasPrice, calculateFee, type MsgSendEncodeObject, SigningStargateClient } from "@cosmjs/stargate";
import { type OfflineSigner } from '@cosmjs/proto-signing';
import { chainDataState, globalState } from "$lib/stores/walletStore";
import { get } from "svelte/store";
import { Decimal } from "@cosmjs/math";
export async function simulateAndGetFees(msgs: MsgSendEncodeObject[], memo: string) {
    const chainData = get(chainDataState);
    const offlineSigner: OfflineSigner = window.getOfflineSigner!(chainData.chainId);
    const signingClient = await SigningStargateClient.connectWithSigner(
        chainData.rpc,
        offlineSigner
    );
    const gasEstimation = await signingClient.simulate(get(globalState).myAddress, msgs, memo);
    // console.log(gasEstimation)
    const multiplier = 2;
    const gasPrice = new GasPrice(
        Decimal.fromUserInput(String(chainData.fee[0].low_gas_price), chainData.currencies[0].coinDecimals),
        chainData.fee[0].denom,
    );
    const usedFee = calculateFee(Math.round(gasEstimation * multiplier), gasPrice) || 0;
    return usedFee;
}