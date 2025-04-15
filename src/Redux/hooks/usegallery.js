import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getGallery } from '@/Redux/slices/Gallery.slice';

export const useGallery = () => {
    const dispatch = useDispatch();
    const { gallery, loading, error, page, limit, tags, sortName, sortDate } = useSelector((state) => state.gallery);

    useEffect(() => {
        
        if (!loading) {
            dispatch(getGallery({
                page,
                limit,
                tags,
                sortName,
                sortDate,
            }));
        }
    }, [dispatch, page, limit, tags, sortName, sortDate]); 

    return { gallery, loading, error };
}
