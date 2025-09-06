import { useMutation, useQuery } from "convex/react"
import { useEffect, useState } from "react"
import { toast } from "sonner"

export const useConvexQuery = (query, ...args) => {
    const result = useQuery(query,...args)

    const [data, setData] = useState(undefined)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(undefined)

    useEffect(() => {

        if (args.length > 0 && args[0] === "skip") {
            setIsLoading(false);
            setData(null);
            setError(null);
            return;
        }
        
        if (result === undefined) {
            setIsLoading(true);
        }else {
            try {
                setData(result)
                setError(null)
            } catch (error) {
                setError(error)
                toast.error(error.message)
            }finally{
                setIsLoading(false)
            }
        }
    }, [result]);


    return {
        data,
        isLoading,
        error
    }
}


export const useConvexMutation = (mutation) => {
    const mutationFn = useMutation(mutation)

    const [data, setData] = useState(undefined)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(undefined)

    const mutate = async(...args) => {
        setIsLoading(true)
        setError(null)

    try {
        const response = await mutationFn(...args);
        setData(response)
        return response
    } catch (error) {
        setError(error)
        toast.error(error.message)
    }finally{
        setIsLoading(false)
    }
    }


    return {data, mutate, isLoading, error}
}