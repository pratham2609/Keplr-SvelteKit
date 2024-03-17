<script lang="ts">
	import {
		type Coin,
		SigningStargateClient,
		StargateClient,
		assertIsDeliverTxSuccess,
		type MsgSendEncodeObject
	} from '@cosmjs/stargate';
	import { type OfflineSigner } from '@cosmjs/proto-signing';
	import { chainDataState, globalState } from '../lib/stores/walletStore';
	import toast, { Toaster } from 'svelte-french-toast';
	async function updateFaucetBalance() {
		if (!$globalState.faucetAddress.includes($chainDataState.bech32Config.bech32PrefixAccAddr)) {
			toast.error(`Please provide address of ${$chainDataState.chainName} chain`);
		}
		const client = await StargateClient.connect($chainDataState.rpc);
		const balances: readonly Coin[] = await client.getAllBalances($globalState.faucetAddress);
		const first = balances[0];
		globalState.update((localState) => {
			const newState = { ...localState, denom: first.denom, faucetBalance: first.amount };
			return newState;
		});
		toast.success('Fetched Details');
	}
	let txHash = '';
	async function onSendClicked() {
		if (!$globalState.faucetAddress.includes($chainDataState.bech32Config.bech32PrefixAccAddr)) {
			toast.error(`Please provide address of ${$chainDataState.chainName} chain`);
		}
		toast.loading('Sending tokens', { duration: 1000 });
		const { denom, toSend } = $globalState;
		const offlineSigner: OfflineSigner = window.getOfflineSigner!($chainDataState.chainId);
		const signingClient = await SigningStargateClient.connectWithSigner(
			$chainDataState.rpc,
			offlineSigner
		);
		const sendMsg: MsgSendEncodeObject = {
			typeUrl: '/cosmos.bank.v1beta1.MsgSend',
			value: {
				fromAddress: $globalState.myAddress,
				toAddress: $globalState.faucetAddress,
				amount: [{ denom, amount: toSend }]
			}
		};
		const sendResult = await signingClient.signAndBroadcast(
			$globalState.myAddress,
			[sendMsg],
			{ amount: [{ denom: $globalState.denom, amount: '500' }], gas: '200000' },
			$globalState.memo
		);
		txHash = sendResult.transactionHash;
		console.log(sendResult);
		assertIsDeliverTxSuccess(sendResult);
		let myBalance = (await signingClient.getBalance($globalState.myAddress, denom)).amount;
		globalState.update(() => {
			const newState = {
				faucetAddress: '',
				denom: 'denom',
				faucetBalance: '0',
				myAddress: $globalState.myAddress,
				myBalance: myBalance,
				toSend: '0',
				memo: ''
			};
			return newState;
		}); // make the message visible

		setTimeout(function () {
			txHash = ''; // hide the message after 10 seconds
		}, 7000);
	}
	const handleValueChange = (e: Event) => {
		globalState.update((localState) => {
			return {
				...localState,
				[(e.target as HTMLInputElement).name]: (e.target as HTMLInputElement).value
			};
		});
	};
	function copyToClipboard() {
		navigator.clipboard.writeText($globalState.myAddress);
		toast.success("Copied to clipboard");
	}
</script>

<Toaster />
{#if txHash != ''}
	<a
		class="absolute underline text-green-500 top-10 left-1/2 -translate-x-1/2"
		target="_blank"
		href={`https://www.mintscan.io/${$chainDataState.secName}-testnet/tx/${txHash}`}
		>Sent Successfully, click here to check
	</a>
{/if}
<div class="w-full flex flex-col items-center gap-10">
	<div class="w-full flex flex-col gap-5 items-center">
		<fieldset class="card w-full flex flex-col gap-2 px-5 py-2">
			<legend>Check Balance</legend>
			<input
				name="faucetAddress"
				class="px-2 py-1 rounded-lg border-2 bg-transparent text-white"
				placeholder="Address"
				bind:value={$globalState.faucetAddress}
				on:input={handleValueChange}
			/>
			<p>
				Balance: {(Number($globalState.faucetBalance) / 1000000).toFixed(6)}
				{$chainDataState.feeCurrencies[0].coinDenom}
			</p>
			<div class="w-full flex justify-end">
				<button
					class="bg-gray-300 rounded-lg px-2 py-1 text-black font-medium"
					on:click={updateFaucetBalance}>Fetch Details</button
				>
			</div>
		</fieldset>
		<fieldset class="card w-full flex flex-col gap-2 px-5 py-2">
			<legend>You</legend>
			<div class="w-full flex items-center gap-4">
				<p>Address: {$globalState.myAddress}</p>
				<button class="hover:opacity-25 transition" on:click={copyToClipboard}>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="w-6 h-6"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75"
						/>
					</svg>
				</button>
			</div>
			<p>
				Balance: {(Number($globalState.myBalance) / 1000000).toFixed(6)}
				{$chainDataState.feeCurrencies[0].coinDenom}
			</p>
		</fieldset>
		<fieldset class="card w-full flex flex-col gap-3 px-5 py-4">
			<legend>Send</legend>
			<p>Amount to send:</p>
			<input
				bind:value={$globalState.toSend}
				class="rounded-md bg-transparent px-2 py-0"
				name="toSend"
				placeholder="Amount to send"
				on:input={handleValueChange}
			/>
			<label for="memo">write a memo</label>
			<input
				bind:value={$globalState.memo}
				class="rounded-md bg-transparent px-2 py-1"
				name="memo"
				id="memo"
				placeholder="Write a memo!"
				on:input={handleValueChange}
			/>
			<!-- {state.denom} -->
			<button
				class="bg-gray-300 font-medium rounded-lg px-2 py-1 text-black"
				on:click={onSendClicked}>Send to faucet</button
			>
		</fieldset>
	</div>
</div>
