"use client"

import { useState, useCallback } from 'react'
import axiosInstance from '@/constants/apiUtils'
import { useDispatch } from 'react-redux'
import { setPracticeMembers } from '@/store/practice'

export interface PracticeMemberDto {
  user_email: string
  user_name: string
  role: 'OWNER' | 'ADMIN' | 'STAFF'
  is_active: boolean
}

export interface AddMemberPayload {
  email: string
  name?: string
  role?: 'ADMIN' | 'STAFF'
}

export interface EditMemberPayload {
  role?: 'ADMIN' | 'STAFF' | 'OWNER'
  is_active?: boolean
}

const getToken = () => (typeof window !== 'undefined' ? localStorage.getItem('auth_token') || '' : '')

export function usePracticeMembers() {
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchMembers = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const token = getToken()
      const { data } = await axiosInstance.get('/practice/members', {
        params: { user_token: token },
      })
      dispatch(setPracticeMembers(data?.members || []))
      return data?.members || []
    } catch (e: any) {
      const msg = e?.response?.data?.detail || e?.message || 'Failed to fetch members'
      setError(msg)
      throw new Error(msg)
    } finally {
      setLoading(false)
    }
  }, [dispatch])

  const addMember = useCallback(async (payload: AddMemberPayload) => {
    try {
      setLoading(true)
      setError(null)
      const token = getToken()
      const { data } = await axiosInstance.post('/practice/members', payload, {
        params: { user_token: token },
      })
      // Refresh list after add
      await fetchMembers()
      return data
    } catch (e: any) {
      const msg = e?.response?.data?.detail || e?.message || 'Failed to add member'
      setError(msg)
      throw new Error(msg)
    } finally {
      setLoading(false)
    }
  }, [fetchMembers])

  const editMember = useCallback(async (memberEmail: string, payload: EditMemberPayload) => {
    try {
      setLoading(true)
      setError(null)
      const token = getToken()
      const { data } = await axiosInstance.put('/practice/members', payload, {
        params: { user_token: token, member_email: memberEmail },
      })
      await fetchMembers()
      return data
    } catch (e: any) {
      const msg = e?.response?.data?.detail || e?.message || 'Failed to edit member'
      setError(msg)
      throw new Error(msg)
    } finally {
      setLoading(false)
    }
  }, [fetchMembers])

  return {
    loading,
    error,
    fetchMembers,
    addMember,
    editMember,
  }
}


