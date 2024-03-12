// import axios from "axios"
// import { error } from '@sveltejs/kit';
// import type { PageServerLoad } from './$types';
// export const load: PageServerLoad = async () => {
//     // const data = await axios.get("https://cosmos-rest.publicnode.com/cosmos/bank/v1beta1/balances/cosmos14lultfckehtszvzw4ehu0apvsr77afvyhgqhwh");
//     const data = await axios.get("https://chains.cosmos.directory/cosmoshub");
//     if (data) { return data.data; }
//     error(404, 'Not found');
// }