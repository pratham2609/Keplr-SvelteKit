// import type { ChainInfo } from '@keplr-wallet/types';
// import { get } from 'svelte/store';


// export async function isConnected(): Promise<boolean> {
// 	const isConnected = checkWasWallectConnected();
// 	wasWalletConnected.set(isConnected);
// 	isWalletConnected.set(isConnected && get(isWalletEnabled));
// 	return get(isWalletConnected);
// }



// export const enableKeplr = async (chainIds: string | string[]) => {
// 	const theClient = get(walletProvider);

// 	if (!theClient) return false;
// 	try {
// 		await theClient.enable(chainIds);
// 		isWalletEnabled.set(true);
// 		return true;
// 	} catch (error) {
// 		isWalletEnabled.set(false);
// 		throw error;
// 	}
// };

// export const keplrConnection = async (provider: WalletProviderKey, network?: Network) => {
// 	if (!window) return;
// 	// setWalletSigningClient(provider);

// 	try {
// 		await addEviaChain();
// 		const chainId = network?.chainId;
// 		const chainIds = await filterChains(chainId);

// 		try {
// 			const isEnabled = await enableKeplr(chainIds);
// 			if (!isEnabled) throw new Error(`Wallet is not enabled`);
// 		} catch (error) {
// 			if (network) {
// 				const experimentalChain = network.keplrChain();
// 				await injectChain(experimentalChain);
// 				console.log('Injected', experimentalChain.chainName, experimentalChain.chainId);
// 				await enableKeplr(chainIds);
// 			}
// 		}

// 		if (chainId) {
// 			getAddress(chainId).then((add) => currentChainAddress.set(new WalletAccount(add)));
// 		}

// 		await postUser();

// 		localStorage.setItem(keplrLSKey, provider);
// 		await isConnected();
// 		return true;
// 	} catch (error) {
// 		console.log(error);
// 		throw error;
// 	}
// };

// export async function addEviaChain() {
// 	const theClient = get(walletProvider)!;

// 	try {
// 		await theClient.experimentalSuggestChain(EviaNetwork);
// 	} catch (error) {
// 		keplrDisconnection();
// 		throw new Error('User Rejected');
// 	}
// }

// export const injectChain = async (chain: ChainInfo) => {
// 	const theClient = get(walletProvider)!;

// 	try {
// 		await theClient.experimentalSuggestChain(chain);
// 	} catch (error) {
// 		keplrDisconnection();
// 		console.log(error);
// 		throw error;
// 	}
// };

// export function keplrDisconnection() {
// 	if (!window || !window.keplr) return;
// 	localStorage.removeItem(keplrLSKey);
// 	isWalletConnected.set(false);
// 	walletProvider.set(null);
// 	eviaAddress.set(null);
// 	currentChainAddress.set(null);
// }

// export async function getAddress(chainId: string) {
// 	const theClient = get(walletProvider)!;
// 	const address = await theClient.getKey(chainId);
// 	return address;
// }


// export async function getBalance(chainId: string) {
//     try {
//         const data = await axios.get(`https://cosmos-rest.publicnode.com/cosmos/bank/v1beta1/balances/${chainId}`);
//         if (data) {
//             const balance: CoinPrimitive[] = data.data;
//             return balance;
//         }
//     } catch (error) {
//         console.log(error);
//         // return []
//     }
// }
