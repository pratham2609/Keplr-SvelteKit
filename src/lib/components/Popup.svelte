<script lang="ts">
	import { get } from 'svelte/store';
	import toast from 'svelte-french-toast';
	import { globalState, type InitialValidatorState } from '$lib/stores/walletStore';
	import useDelegation from '$lib/actions/useDelegation';
	export let isShow: boolean;
	let action = '';
	export let data: InitialValidatorState;
	$: state = get(globalState);
	$: stake = useDelegation();
	$: sendState = {
		toAddress: '',
		toSend: '',
		memo: '',
		denom: state.denom
	};
	const handleValueChange = (e: Event) => {
		sendState = {
			...sendState,
			[(e.target as HTMLInputElement).name]: (e.target as HTMLInputElement).value
		};
	};
	const handleClick = () => {
		$stake.mutate(
			{
				myAddress: state.myAddress,
				toAddress: data.address,
				toSend: state.toSend,
				memo: state.memo,
				denom: state.denom
			},
			{
				onSuccess: (data) => {
					console.log(data);
					toast.success('Successfully Staked');
					isShow = false;
				},
				onError: (error) => {
					console.log(error);
					toast.error('Transaction failed');
				}
			}
		);
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
						bind:value={sendState.toSend}
						class="rounded-md bg-transparent px-2 py-0"
						name="toSend"
						placeholder="Amount to send"
						on:input={handleValueChange}
					/>
					<input
						bind:value={sendState.memo}
						class="rounded-md bg-transparent px-2 py-0"
						name="memo"
						placeholder="Write a memo!"
						on:input={handleValueChange}
					/>
					<button
						class="bg-gray-300 font-medium rounded-lg px-2 py-1 text-black"
						on:click={handleClick}>Stake</button
					>
				{:else if action == 'withdraw'}
					<input
						bind:value={sendState.memo}
						class="rounded-md bg-transparent px-2 py-0"
						name="memo"
						placeholder="Write a memo!"
						on:input={handleValueChange}
					/>
					<button
						class="bg-gray-300 font-medium rounded-lg px-2 py-1 text-black"
						on:click={handleClick}>Withdraw</button
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
