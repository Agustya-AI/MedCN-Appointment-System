import axiosInstance from "@/utils/apiUtils";
import { RootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { setAllPractices } from "@/store/app";



export default function usePractice() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPractice, setCurrentPractice] = useState<any>(null);
    const [currentPractitioners, setCurrentPractitioners] = useState<any>(null);
    const practices = useSelector((state: RootState) => state.appService.all_practices);


    const dispatch = useDispatch();


    const fetchAllPractices = async () => {
        try {
            const response = await axiosInstance.get('/patient/practices');
            if (response.status === 200) {
                dispatch(setAllPractices(response.data));
            }
        } catch (error) {
            setError(error as string);
        } finally {
            setLoading(false);
        }
    }

    const getCurrentPractice = async (practice_id: number) => {
        try {
            const response = await axiosInstance.get(`/patient/practice/${practice_id}`);
            if (response.status === 200) {
                setCurrentPractice(response.data);
            }
        } catch (error) {
            setError(error as string);
        } finally { 
            setLoading(false);
        }
    }

    const getCurrentPractitioners = async (practice_id: number) => {
        try {
            const response = await axiosInstance.get(`/patient/practice/${practice_id}/doctors`);
            if (response.status === 200) {
                setCurrentPractitioners(response.data);
            }
        } catch (error) {
            setError(error as string);
        } finally {
            setLoading(false);
        }
    }


    return { practices, loading, error, fetchAllPractices, getCurrentPractice, currentPractice, getCurrentPractitioners, currentPractitioners };
}   