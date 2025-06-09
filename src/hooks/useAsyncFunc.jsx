import { useState, useEffect } from 'react';

const useAsyncLoading = () => {
    const [isLoading, setIsLoading] = useState(false);

    // This useEffect will set isLoading to true when a request is made, and false when it completes.
    useEffect(() => {
        return () => {
            setIsLoading(false); // Reset loading state when the component unmounts
        };
    }, []);

    const runAsyncFunction = async (asyncFunction) => {
        setIsLoading(true);
        try {
            await asyncFunction();
        } catch (error) {
            // Handle error if necessary
        } finally {
            setIsLoading(false);
        }
    };

    return {
        isLoading,
        runAsyncFunction,
    };
}

export default useAsyncLoading;