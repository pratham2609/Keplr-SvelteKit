<script lang="ts">
	import Popup from './Popup.svelte';
	import Delegations from './Delegations.svelte';
	import Validators from './Validators.svelte';
	import { ValidatorState, type InitialValidatorState } from '$lib/stores/walletStore';
	import useGetValidators from '$lib/actions/useGetValidators';
	import useGetDelegations from '$lib/actions/useGetDelegations';
	$: validatorsList = useGetValidators();
	$: delegations = useGetDelegations();
	let selected = 'delegations';
	const validatorMonikerMap: { [key: string]: string } = {};
	$validatorsList?.data?.map((item) => {
		validatorMonikerMap[item.address] = item.moniker;
	});
	$: rewards = $delegations?.data?.map((item) => {
		return { ...item, validator: validatorMonikerMap[item.validator_address] };
	});
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
<section class="w-screen flex flex-col items-center gap-5 px-20">
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
		<Delegations rewards={rewards} />
	{:else}
		<Validators {togglePopup} validators={$validatorsList.data} />
	{/if}
</section>
