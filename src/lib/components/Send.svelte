<script lang="ts">
	import {
		type Coin,
		StargateClient,
		type StdFee,
		type MsgSendEncodeObject
	} from '@cosmjs/stargate';
	import toast, { Toaster } from 'svelte-french-toast';
	import { chainDataState, globalState } from '$lib/stores/walletStore';
	import onSendClicked from '$lib/actions/useSendTokens';
	import useGetUsersBalance from '$lib/actions/useGetUserBalance';
	import { simulateAndGetFees } from '$lib/actions/getFees';
	$: balance = useGetUsersBalance();
	$: checkBalance = '0';
	$: checkUser = '';
	$: sendTokens = onSendClicked();
	async function updateFaucetBalance() {
		if (!checkUser.includes($chainDataState.bech32Config.bech32PrefixAccAddr)) {
			toast.error(`Please provide address of ${$chainDataState.chainName} chain`);
			return;
		}
		const client = await StargateClient.connect($chainDataState.rpc);
		const balances: readonly Coin[] = await client.getAllBalances(checkUser);
		const first = balances[0];
		checkBalance = first.amount;
		toast.success('Fetched Details');
	}
	let txFees: StdFee;
	$: txHash = '';
	$: sendState = {
		to: '',
		amount: '',
		memo: ''
	};
	const onClick = async () => {
		$sendTokens.mutate(
			{
				toAddress: sendState.to,
				myAddress: $globalState.myAddress,
				sendAmount: sendState.amount,
				memo: sendState.memo,
				denom: $globalState.denom
			},
			{
				onSuccess: (data) => {
					txHash = data;
					sendState = {
						to: '',
						amount: '',
						memo: ''
					};
				},
				onError: (error) => {
					console.log(error);
					toast.error('Transaction failed');
				}
			}
		);
	};
	const handleValueChange = (e: Event) => {
		sendState = {
			...sendState,
			[(e.target as HTMLInputElement).name]: (e.target as HTMLInputElement).value
		};
	};
	const handleCheckUserChange = (e: Event) => {
		checkUser = (e.target as HTMLInputElement).value;
		if (checkUser == '') {
			checkBalance = '0';
		}
	};
	function copyToClipboard() {
		navigator.clipboard.writeText($globalState.myAddress);
		toast.success('Copied to clipboard');
	}
	const getSimulatedFees = async () => {
		const sendMsg: MsgSendEncodeObject = {
			typeUrl: '/cosmos.bank.v1beta1.MsgSend',
			value: {
				fromAddress: $globalState.myAddress,
				toAddress: sendState.to,
				amount: [{ denom: $globalState.denom, amount: sendState.amount }]
			}
		};
		txFees = await simulateAndGetFees([sendMsg], sendState.memo);
		console.log(txFees);
	};
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
				bind:value={checkUser}
				on:input={handleCheckUserChange}
			/>
			<p>
				Balance: {(Number(checkBalance) / 1000000).toFixed(6)}
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
				Balance: {(Number($balance.data?.balance) / 1000000).toFixed(6)}
				{$chainDataState.feeCurrencies[0].coinDenom}
			</p>
		</fieldset>
		<fieldset class="card w-full flex flex-col gap-3 px-5 py-4">
			<legend>Send</legend>
			<div class="flex flex-col gap-2">
				<label for="to">To:</label>
				<input
					bind:value={sendState.to}
					class="rounded-md bg-transparent px-2 py-1"
					name="to"
					id="to"
					placeholder="To"
					on:input={handleValueChange}
				/>
			</div>
			<p>Amount to send:</p>
			<input
				bind:value={sendState.amount}
				class="rounded-md bg-transparent px-2 py-1"
				name="amount"
				placeholder="Amount to send"
				on:input={handleValueChange}
			/>
			<label for="memo">write a memo</label>
			<input
				bind:value={sendState.memo}
				class="rounded-md bg-transparent px-2 py-1"
				name="memo"
				id="memo"
				placeholder="Write a memo!"
				on:input={handleValueChange}
			/>
			<div class="w-full flex justify-end gap-3 items-center">
				Tx Fees: {txFees === undefined
					? '0'
					: `${txFees.amount[0].amount} ${txFees.amount[0].denom}`}
				<button class="px-3 py-1 bg-gray-700 rounded-md font-medium" on:click={getSimulatedFees}
					>Simulate</button
				>
			</div>
			<button class="bg-gray-300 font-medium rounded-lg px-2 py-1 text-black" on:click={onClick}
				>Send Tokens</button
			>
		</fieldset>
	</div>
</div>
