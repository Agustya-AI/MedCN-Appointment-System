"use client"

import React, { useEffect, useMemo, useState } from 'react'
import AdminPortalLayout from '@/app/admin/_components/AdminPortalLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { usePracticeMembers, EditMemberPayload } from '../hooks/usePracticeMembers'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'
import { useSearchParams, useRouter } from 'next/navigation'

export default function EditMemberPage() {
  const { fetchMembers, editMember, loading, error } = usePracticeMembers()
  const searchParams = useSearchParams()
  const router = useRouter()
  const email = searchParams.get('email') || ''
  const members = useSelector((state: RootState) => state.practiceService.practiceMembers)

  const existing = useMemo(() => members.find((m: any) => m.user_email === email), [members, email])
  const [payload, setPayload] = useState<EditMemberPayload>({ role: undefined, is_active: undefined })
  const [formError, setFormError] = useState<string | null>(null)

  useEffect(() => {
    fetchMembers()
  }, [fetchMembers])

  useEffect(() => {
    if (existing) {
      setPayload({ role: existing.role, is_active: existing.is_active })
    }
  }, [existing])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)
    if (!email) {
      setFormError('Missing member email')
      return
    }
    try {
      await editMember(email, payload)
      router.push('/admin/practice-members')
    } catch (e: any) {
      setFormError(e.message)
    }
  }

  return (
    <AdminPortalLayout>
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Edit Practice Member</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Email</Label>
                <Input value={email} disabled />
              </div>
              <div className="space-y-2">
                <Label>Role</Label>
                <Select value={payload.role} onValueChange={(v) => setPayload(prev => ({ ...prev, role: v as any }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="STAFF">Staff</SelectItem>
                    <SelectItem value="ADMIN">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={payload.is_active ? 'active' : 'inactive'} onValueChange={(v) => setPayload(prev => ({ ...prev, is_active: v === 'active' }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex gap-2">
              <Button type="submit" disabled={loading}>Save</Button>
              <Button type="button" variant="outline" onClick={() => router.push('/admin/(setup)/practice-members')}>Cancel</Button>
            </div>
            {formError && <p className="text-sm text-red-500">{formError}</p>}
            {error && <p className="text-sm text-red-500">{error}</p>}
          </form>
        </CardContent>
      </Card>
    </AdminPortalLayout>
  )
}


