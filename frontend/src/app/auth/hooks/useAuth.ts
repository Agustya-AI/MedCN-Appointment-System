"use client"


import appAPI from "@/utils/apiUtils"
import { useRouter } from "next/navigation"
import { useState } from "react"


export default function useAuth() {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<any>(null)
    

    const router = useRouter();

    const login = async (email: string, password: string) => {

        try {
            const response = await appAPI.post('/patient/login', { email, password })

            // if response is 200, set the user details in the store
            if (response.status === 200) {
                localStorage.setItem('user_token', response.data.token)
                router.push('/dashboard')
            }
            
        } catch (error:any) {
            setError(error?.response?.data?.detail)
        } finally {
            setIsLoading(false)
        }
    }

    const register = async (email: string, password: string, first_name: string, date_of_birth: string) => {
        try {
            const response = await appAPI.post('/patient/register', { email, password, first_name, date_of_birth })
            console.log(response)
        } catch (error:any) {
            setError(error?.response?.data?.detail)
        } finally { 
            setIsLoading(false)
        }
    }


    return {
        isLoading,
        error,
        login,
        register,
        setError
    }
}       