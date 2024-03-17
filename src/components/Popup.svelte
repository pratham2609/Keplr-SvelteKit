<script lang="ts">
	import { type InitialValidatorState } from './../lib/stores/walletStore';
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
	import toast from 'svelte-french-toast';
	export let isShow = false;
	let action = '';
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
			{ amount: [{ denom: $globalState.denom, amount: '500' }], gas: '200000' },
			state.memo
		);
		globalState.update((lastState) => {
			return {
				...lastState,
				toSend: '0',
				memo: ''
			};
		});
		assertIsDeliverTxSuccess(res);
		toast.success('Successfully Staked');
		isShow = false
	};
</script>

{#if isShow}
	<div
		class="w-[600px] h-[500px] backdrop-blur-lg z-10 p-5 bg-gray-800 rounded-md absolute flex flex-col justify-between gap-5 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
	>
		<div class="w-full flex items-center justify-between">
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
		<div class="w-full flex flex-col justify-between h-full gap-5">
			<div class="flex flex-col gap-2">
				<p>name : {data.name || data.moniker}</p>
				<p>rank : #{data.rank}</p>
				<p>address : {data.address}</p>
				<p>uptime : {data.uptime * 100 + '%'}</p>
				<p>Comission : {data.commission.rate * 100 + '%'}</p>
			</div>
			<div class="w-full flex flex-col gap-3">
				{#if action == 'stake'}
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
					<button class="bg-gray-300 font-medium rounded-lg px-2 py-1 text-black" on:click={stake}
						>Stake</button
					>
				{:else if action == 'withdraw'}
					<input
						bind:value={state.memo}
						class="rounded-md bg-transparent px-2 py-0"
						name="memo"
						placeholder="Write a memo!"
						on:input={handleValueChange}
					/>
					<button class="bg-gray-300 font-medium rounded-lg px-2 py-1 text-black" on:click={stake}
						>Withdraw</button
					>
				{/if}
				<div class="w-full flex items-center gap-4">
					<button
						class={'bg-gray-300 font-medium rounded-lg w-full px-2 py-1 text-black ' +
							(action == 'stake' && 'border-2 border-green-600')}
						on:click={() => {
							action = 'stake';
						}}
						>Delegate
					</button>
					<button
						class={'font-medium rounded-lg w-full bg-yellow-600 text-white px-2 py-1 ' +
							(action == 'withdraw' && 'border-2 border-green-600')}
						on:click={() => {
							action = 'withdraw';
						}}
						>Withdraw rewards
					</button>
				</div>
			</div>
		</div>
	</div>
{/if}
