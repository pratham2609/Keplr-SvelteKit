<script lang="ts">
	import { onMount } from 'svelte';
	import { type Coin, SigningStargateClient, StargateClient } from '@cosmjs/stargate';
	import { type AccountData, type OfflineSigner } from '@cosmjs/proto-signing';
	import { type ChainInfo } from '@keplr-wallet/types';

	interface State {
		denom: string;
		faucetBalance: string;
		myAddress: string;
		myBalance: string;
		toSend: string;
	}
	let faucetAddress = 'cosmos15aptdqmm7ddgtcrjvc5hs988rlrkze40l4q0he';
	let rpcUrl = 'https://rpc.sentry-01.theta-testnet.polypore.xyz';
	const initialState: State = {
		denom: 'Loading...',
		faucetBalance: 'Loading...',
		myAddress: 'Click first',
		myBalance: 'Click first',
		toSend: '0'
	};

	let state: State = initialState;

	async function init() {
		await updateFaucetBalance(await StargateClient.connect(rpcUrl));
	}

	async function updateFaucetBalance(client: StargateClient) {
		const balances: readonly Coin[] = await client.getAllBalances(faucetAddress);
		const first = balances[0];
		state.denom = first.denom;
		state.faucetBalance = first.amount;
	}

	function onToSendChanged(e: Event) {
		state.toSend = (e.target as HTMLInputElement).value;
	}

	async function onSendClicked() {
		// Detect Keplr
		const { keplr } = window;
		if (!keplr) {
			alert('You need to install Keplr');
			return;
		}

		const { denom, toSend } = state;

		// Suggest the testnet chain to Keplr
		await keplr.experimentalSuggestChain(getTestnetChainInfo()); // injects non native chains

		// Create the signing client
		const offlineSigner: OfflineSigner = window.getOfflineSigner!('theta-testnet-001');
		const signingClient = await SigningStargateClient.connectWithSigner(rpcUrl, offlineSigner);

		// Get the address and balance of your user
		const account: AccountData = (await offlineSigner.getAccounts())[0];
		state.myAddress = account.address;
		state.myBalance = (await signingClient.getBalance(account.address, denom)).amount;

		// Submit the transaction to send tokens to the faucet
		const sendResult = await signingClient.sendTokens(
			account.address,
			faucetAddress,
			[{ denom, amount: toSend }],
			{ amount: [{ denom: 'uatom', amount: '500' }], gas: '200000' }
		);
		console.log(sendResult);
        
		// Update the balance in the user interface
		state.myBalance = (await signingClient.getBalance(account.address, denom)).amount;
		state.faucetBalance = (await signingClient.getBalance(faucetAddress, denom)).amount;
	}

	function getTestnetChainInfo(): ChainInfo {
		return {
			chainId: 'theta-testnet-001',
			chainName: 'theta-testnet-001',
			rpc: 'https://rpc.sentry-01.theta-testnet.polypore.xyz/',
			rest: 'https://rest.sentry-01.theta-testnet.polypore.xyz/',
			bip44: {
				coinType: 118
			},
			bech32Config: {
				bech32PrefixAccAddr: 'cosmos',
				bech32PrefixAccPub: 'cosmos' + 'pub',
				bech32PrefixValAddr: 'cosmos' + 'valoper',
				bech32PrefixValPub: 'cosmos' + 'valoperpub',
				bech32PrefixConsAddr: 'cosmos' + 'valcons',
				bech32PrefixConsPub: 'cosmos' + 'valconspub'
			},
			currencies: [
				{
					coinDenom: 'ATOM',
					coinMinimalDenom: 'uatom',
					coinDecimals: 6,
					coinGeckoId: 'cosmos'
				},
				{
					coinDenom: 'THETA',
					coinMinimalDenom: 'theta',
					coinDecimals: 0
				}
				// ... existing code ...
			],
			feeCurrencies: [
				{
					coinDenom: 'ATOM',
					coinMinimalDenom: 'uatom',
					coinDecimals: 6,
					coinGeckoId: 'cosmos'
				}
			],
			stakeCurrency: {
				coinDenom: 'ATOM',
				coinMinimalDenom: 'uatom',
				coinDecimals: 6,
				coinGeckoId: 'cosmos'
			},
			coinType: 118,
			features: ['stargate', 'ibc-transfer', 'no-legacy-stdTx']
		};
	}

	onMount(async () => {
		await init();
	});
</script>

<div class="w-screen h-screen flex items-center justify-center flex-col">
	<div class="max-w-screen-lg mx-auto flex flex-col items-center">
		<div class="description">Send back to the faucet</div>
		<fieldset class="card w-full px-5 py-2">
			<legend>Faucet</legend>
			<p>Address: {faucetAddress}</p>
			<p>Balance: {state.faucetBalance}</p>
		</fieldset>
		<fieldset class="card w-full px-5 py-2">
			<legend>You</legend>
			<p>Address: {state.myAddress}</p>
			<p>Balance: {state.myBalance}</p>
		</fieldset>
		<fieldset class="card w-full flex flex-col gap-3 px-5 py-2">
			<legend>Send</legend>
			<p>To faucet:</p>
			<input
				bind:value={state.toSend}
				class="rounded-md bg-transparent px-2 py-0"
				type="number"
				on:input={onToSendChanged}
			/>
			{state.denom}
			<button on:click={onSendClicked}>Send to faucet</button>
		</fieldset>
	</div>
</div>
