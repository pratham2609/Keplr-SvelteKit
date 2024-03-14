<script lang="ts">
	import { ValidatorState, type InitialValidatorState } from '../lib/stores/walletStore';
	import Popup from './Popup.svelte';
	export let data: InitialValidatorState[];
	let pageData = data.filter((val) => val.active === true);
	const myDelegations = [];
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
		<table class="w-full flex flex-col items-center">
			<tr class="w-full flex justify-center mb-5">
				<th class="font-bold">My delegations</th>
			</tr>

			{#if myDelegations.length == 0}
				<p>No Stakes yet</p>
			{:else}
				{#each myDelegations as val}
					<tr class="w-full flex mb-2 justify-center">
						<td class="w-[300px] flex justify-between items-center">
							<p>
								{val.name ? val.name : val.moniker}
							</p>
							<button class="bg-green-400 rounded-lg px-2 py-1">Stake</button>
						</td>
					</tr>
				{/each}
			{/if}
		</table>
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
