import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store";
import { setCurrentPracticeDetails } from "@/store/practice";
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