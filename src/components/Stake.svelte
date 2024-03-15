<script lang="ts">
	import { type Coin } from '@cosmjs/stargate';
	import {
		ValidatorState,
		type InitialValidatorState,
		globalState
	} from '../lib/stores/walletStore';
	import Popup from './Popup.svelte';
	import { onMount } from 'svelte';
	import axios from 'axios';
	import type { Reward } from '../routes/global';
	export let data: InitialValidatorState[];
	let pageData = data.filter((val) => val.active === true);
	let selected = 'delegations';
	const changeMode = (newMode: string) => {
		selected = newMode;
	};
	let modalData = ValidatorState;
	let popupOpen = false;

	function togglePopup(val: InitialValidatorState) {
		popupOpen = !popupOpen;
		modalData = val;
	}
	let myDelegations: Reward[] = [
		{
			validator_address: 'cosmosvaloper1',
			reward: [{ denom: 'uatom', amount: '500' }]
		}
	];
	let total: Coin;

	onMount(async () => {
		const data = await axios.get(`
		https://rest.testcosmos.directory/cosmoshubtestnet/cosmos/distribution/v1beta1/delegators/${$globalState.myAddress}/rewards`);
		myDelegations = data.data.rewards;
		total = data.data.total[0];
	});
</script>

<Popup isShow={popupOpen} data={modalData} />
<section class="w-screen h-screen flex flex-col items-center gap-5 px-20">
	<div class="flex w-[500px] items-center gap-4">
		<button
			on:click={() => changeMode('delegations')}
			class={`w-full rounded-md py-1 px-2 flex-1 ${selected == 'delegations' ? 'bg-gray-600 font-bold' : 'opacity-85 bg-gray-800'}`}
			>My delegations</button
		>
		<button
			on:click={() => changeMode('validators')}
			class={`w-full rounded-md py-1 px-2 flex-1 ${selected == 'validators' ? 'bg-gray-600 font-bold' : 'opacity-85 bg-gray-800'}`}
			>Validators</button
		>
	</div>
	{#if selected == 'delegations'}
		<table class="w-[1200px] flex flex-col items-center">
			<tr class="w-full flex justify-between mb-5">
				<th class="font-bold">validator address</th>
				<th class="font-bold">reward</th>
				<th class="font-bold">Undelegate</th>
			</tr>
			{#each myDelegations as val}
				<tr class="w-full flex justify-between mb-2">
					<td>
						<p>{val.validator_address}</p>
					</td>
					<td>
						{#each val.reward as re}
							<p class="flex">{re.amount} {re.denom}</p>
						{/each}
					</td>
					<td><button class="bg-gray-600 rounded-lg px-2 py-1">Undelegate</button></td>
				</tr>
			{/each}
		</table>
		<!-- <p class="w-[1200px] flex justify-end">
			Total {total.amount}
			{total.denom}
		</p> -->
	{:else}
		<table class="w-full flex flex-col items-center">
			<tr class="w-full flex justify-center mb-5">
				<th class="font-bold">Validator</th>
			</tr>

			{#each pageData as val}
				<tr class="w-full flex mb-2 justify-center">
					<td class="w-[300px] flex justify-between items-center">
						<p>
							{val.name ? val.name : val.moniker}
						</p>
						<button
							on:click={() => {
								togglePopup(val);
							}}
							class="bg-green-600 rounded-lg px-2 py-1">Stake</button
						>
					</td>
				</tr>
			{/each}
		</table>
	{/if}
</section>
