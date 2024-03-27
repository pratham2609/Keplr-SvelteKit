import { createQuery } from '@tanstack/svelte-query';
import { getRewards } from '$lib/actions';
import type { Reward } from '../../routes/global';

function useGetDelegations() {
    const refetchInterval = 10000;
    const getVal = async () => {
        const res = await getRewards()
        return res.rewards as Reward[]
    };
    return createQuery({
        queryKey: ["getDelegations"],
        queryFn: getVal,
        refetchOnMount: true,
        refetchInterval: refetchInterval
    });
}

export default useGetDelegations;