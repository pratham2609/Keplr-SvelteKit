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
		toast.loading('Sending', { duration: 1 });
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
		});
		let toLink = '';
		if ($chainDataState.explorers.find((val) => val.kind == 'mintscan')) {
			toLink = `https://www.mintscan.io/${$chainDataState.secName}/tx/`;
		} else {
			toLink = $chainDataState.explorers[0].url;
		}
		toast.success(
			`Send Successfully, check transaction at
			<a href=${toLink + sendResult.transactionHash}>This link</a>
		`,
			{ duration: 7000 }
		);
	}
	const handleValueChange = (e: Event) => {
		globalState.update((localState) => {
			return {
				...localState,
				[(e.target as HTMLInputElement).name]: (e.target as HTMLInputElement).value
			};
		});
	};
</script>

<Toaster />
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
				{$globalState.denom}
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
			<p>Address: {$globalState.myAddress}</p>
			<p>Balance: {(Number($globalState.myBalance) / 1000000).toFixed(6)} {$globalState.denom}</p>
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
