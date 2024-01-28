import { router } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react'

const useFilter = (states,route) => {
    const dynamicParams = useMemo(() => {
        const params = {};
        Object.keys(states).map(key => {
            if(states[key] !== undefined && states[key] !== null && states[key] !== '' && states[key] !== 'all'){
                params[key] = states[key]
            }
        })
        return params;
    },[...Object.values(states)])

    const [isFilter,setIsFilter] = useState(false);

    useEffect(() => {
        if(isFilter){
            router.get(route,dynamicParams,{
                preserveState:true,
                preserveScroll:true
            })
        }
    },[isFilter,dynamicParams,route])

    return {isFilter,setIsFilter,dynamicParams}

}

export default useFilter