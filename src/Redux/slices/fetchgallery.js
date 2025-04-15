

import useSWR from 'swr';
import Axios from '@/Api/Axios'; // Assuming Axios is set up for API calls

const fetchGallery = async (url) => {
    const { data } = await Axios.get(url);
    return data;
};

const useGallery = ({ page, limit, tags, sortName, sortDate }) => {
    // Build the query URL dynamically based on params
    const queryParams = `?page=${page}&limit=${limit}&tags=${tags}&sortName=${sortName}&sortDate=${sortDate}`;

    // Use SWR to fetch data and auto-refetch when dependencies change
    const { data, error, mutate } = useSWR(`/galleryview${queryParams}`, fetchGallery, {
        revalidateOnFocus: true, // Auto-fetch when window is refocused
        revalidateOnReconnect: true, // Auto-fetch when reconnected to the internet
    });

    return {
        gallery: data ? data.contacts : [],
        isLoading: !error && !data,
        isError: error,
        mutate,
    };
};

export default useGallery;
