<script lang="ts">
	// import { onMount } from 'svelte';
	import {
		type InitialValidatorState,
		ValidatorState,
		// globalState
	} from './../lib/stores/walletStore';
	export let isShow = false;
	export let data: InitialValidatorState = ValidatorState;
	// import axios from 'axios';
	// import { createQuery, useQueryClient } from '@tanstack/svelte-query';
	// type Post = {
	// 	id: number;
	// 	title: string;
	// 	body: string;
	// };
	// const getPosts = async (limit: number) => {
	// 	const response = await fetch('https://jsonplaceholder.typicode.com/posts');
	// 	const data = (await response.json()) as Post[];
	// 	return data.filter((x) => x.id <= limit);
	// };
	// let limit = 10;
	// const posts = createQuery<{ id: number; title: string; body: string }[], Error>({
	// 	queryKey: ['posts', limit],
	// 	queryFn: () => getPosts(limit)
	// });
	// console.log(posts);
</script>

{#if isShow}
	<div class={'w-screen z-10 h-screen backdrop-blur-sm relative transition origin-top '}>
		<div
			class="w-[500px] h-[500px] bg-gray-800 rounded-md absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
		>
			<div class="w-full h-12 flex items-center justify-between px-5">
				<h1 class="text-white font-bold">Stake</h1>
				<button
					on:click={() => {
						isShow = !isShow;
						console.log(isShow);
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
			<div></div>
		</div>
	</div>
{/if}
