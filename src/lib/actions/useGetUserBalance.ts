import { createQuery } from '@tanstack/svelte-query';
import { getBalance } from '$lib/actions';

function useGetUsersBalance() {
    const refetchInterval = 5000;
    const getBal = async () => {
        const res = await getBalance()
        return {
            balance: res
        }
    };
    return createQuery({
        queryKey: ["userBalance"],
        queryFn: getBal,
        refetchOnMount: true,
        refetchInterval: refetchInterval
    });
}

export default useGetUsersBalance;