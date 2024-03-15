<script lang="ts">
	import { type InitialValidatorState, ValidatorState } from './../lib/stores/walletStore';
	import { get } from 'svelte/store';
	import { globalState } from './../lib/stores/walletStore';
	import {
		assertIsDeliverTxSuccess,
		SigningStargateClient,
		type MsgDelegateEncodeObject
	} from '@cosmjs/stargate';
	import { chainDataState } from '../lib/stores/walletStore';
	import { MsgDelegate } from 'cosmjs-types/cosmos/staking/v1beta1/tx';
	import { type OfflineSigner } from '@cosmjs/proto-signing';
	export let isShow = false;
	let isDelegating = false;
	export let data: InitialValidatorState;
	$: state = get(globalState);
	const handleValueChange = (e: Event) => {
		state = {
			...state,
			[(e.target as HTMLInputElement).name]: (e.target as HTMLInputElement).value
		};
	};
	const stake = async () => {
		const { denom, toSend } = state;
		const offlineSigner: OfflineSigner = window.getOfflineSigner!($chainDataState.chainId);
		const signingClient = await SigningStargateClient.connectWithSigner(
			$chainDataState.rpc,
			offlineSigner
		);
		const delegateMsg: MsgDelegateEncodeObject = {
			typeUrl: '/cosmos.staking.v1beta1.MsgDelegate',
			value: MsgDelegate.fromPartial({
				delegatorAddress: state.myAddress,
				validatorAddress: data.address,
				amount: { denom, amount: toSend }
			})
		};
		const res = await signingClient.signAndBroadcast(
			state.myAddress,
			[delegateMsg],
			{ amount: [{ denom: 'uatom', amount: '500' }], gas: '200000' },
			state.memo
		);
		assertIsDeliverTxSuccess(res);
	};
</script>

{#if isShow}
	<div
		class="w-[500px] h-[500px] z-10 bg-gray-800 rounded-md absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
	>
		<div class="w-full h-12 flex items-center justify-between px-5">
			<h1 class="text-white font-bold">Stake</h1>
			<button
				on:click={() => {
					isShow = !isShow;
				}}
				class="text-white
                font-bold
                bg-gray-800
                rounded-md
                px-2
                py-1
                transition
                duration-300
                ease-in-out
                hover:bg-gray-600"
			>
				Close
			</button>
		</div>
		<div class="w-full p-4 flex flex-col gap-5">
			<div class="flex flex-col gap-2">
				<p>name : {data.name || data.moniker}</p>
				<p>address : {data.address}</p>
				<p>uptime : {data.uptime * 100 + '%'}</p>
			</div>
			<button
				class="bg-gray-300 font-medium rounded-lg px-2 py-1 text-black"
				on:click={() => {
					isDelegating = true;
				}}
				>Delegate
			</button>
			{#if isDelegating}
				<input
					bind:value={state.toSend}
					class="rounded-md bg-transparent px-2 py-0"
					name="toSend"
					placeholder="Amount to send"
					on:input={handleValueChange}
				/>
				<input
					bind:value={state.memo}
					class="rounded-md bg-transparent px-2 py-0"
					name="memo"
					placeholder="Write a memo!"
					on:input={handleValueChange}
				/>
				<!-- {state.denom} -->
				<button class="bg-gray-300 font-medium rounded-lg px-2 py-1 text-black" on:click={stake}
					>Send to faucet</button
				>
			{/if}
		</div>
	</div>
{/if}
