import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store";
import { setCurrentPracticeDetails, setAllPractionersAssociatedWithPractice } from "@/store/practice";
import axios from "@/constants/apiUtils";

export default function usePracticeData() {
  const dispatch = useDispatch<AppDispatch>();

  const practice = useSelector(
    (state: RootState) => state.practiceService.currentPracticeDetails
  );

  const [loading, setLoading] = useState(!Object.keys(practice || {}).length);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    if (Object.keys(practice || {}).length) return;

    const controller = new AbortController();
    (async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("auth_token"); // or cookies / headers
        console.log("token", token);
        const { data } = await axios.get(
          "/practice/current-practice-details",
          { params: { user_token: token }, signal: controller.signal }
        );
        dispatch(setCurrentPracticeDetails(data));
      } catch (err) {
        dispatch(setCurrentPracticeDetails(null));
        setError(err);
      } finally {
        setLoading(false);
      }
    })();

    return () => controller.abort();
  }, [practice, dispatch]);

  return { practice, loading, error };
}

export function usePractitioners() {
  const dispatch = useDispatch<AppDispatch>();

  const practitioners = useSelector(
    (state: RootState) => state.practiceService.allPractionersAssociatedWithPractice
  );

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);
  const hasFetched = useRef(false); // Track if we've made the initial fetch

  const fetchPractitioners = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("auth_token");
      if (!token) {
        throw new Error("Authentication token not found");
      }
      
      console.log("Fetching practitioners...");
      const { data } = await axios.get(
        "/practice/practitioners",
        { params: { user_token: token } }
      );
      
      dispatch(setAllPractionersAssociatedWithPractice(data.practitioners || []));
      console.log("Practitioners fetched:", data.practitioners);
      hasFetched.current = true; // Mark as fetched
    } catch (err) {
      dispatch(setAllPractionersAssociatedWithPractice([]));
      setError(err);
      console.error("Failed to fetch practitioners:", err);
      hasFetched.current = true; // Mark as fetched even on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Only fetch if we haven't fetched before
    if (hasFetched.current) {
      setLoading(false);
      return;
    }

    fetchPractitioners();
  }, [dispatch]); // Remove practitioners from dependencies

  const refetchPractitioners = () => {
    hasFetched.current = false; // Reset the flag to allow refetch
    fetchPractitioners();
  };

  return { 
    practitioners: Array.isArray(practitioners) ? practitioners : [], 
    loading, 
    error, 
    refetchPractitioners 
  };
}