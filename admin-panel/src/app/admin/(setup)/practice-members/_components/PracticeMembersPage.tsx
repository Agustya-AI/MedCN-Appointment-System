"use client"

import React, { useEffect, useMemo, useState } from 'react'
import AdminPortalLayout from '@/app/admin/_components/AdminPortalLayout'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { usePracticeMembers, PracticeMemberDto, AddMemberPayload } from '../hooks/usePracticeMembers'
import Link from 'next/link'

export default function PracticeMembersPage() {
  const { fetchMembers, addMember, loading, error } = usePracticeMembers()
  const members = useSelector((state: RootState) => state.practiceService.practiceMembers) as PracticeMemberDto[]

  const [newMember, setNewMember] = useState<AddMemberPayload>({ email: '', name: '', role: 'STAFF' })
  const [formError, setFormError] = useState<string | null>(null)

  useEffect(() => {
    fetchMembers()
  }, [fetchMembers])

  const owner = useMemo(() => members.find(m => m.role === 'OWNER'), [members])
  const staff = useMemo(() => members.filter(m => m.role !== 'OWNER'), [members])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)
    if (!newMember.email) {
      setFormError('Email is required')
      return
    }
    try {
      await addMember(newMember)
      setNewMember({ email: '', name: '', role: 'STAFF' })
    } catch (e: any) {
      setFormError(e.message)
    }
  }

  return (
    <AdminPortalLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold tracking-tight">Practice Members</h1>
          <div className="flex gap-2">
            <Link href="/admin/practice-members/create">
              <Button>Add Member</Button>
            </Link>
          </div>
        </div>

        {/* Owner */}
        {owner && (
          <Card>
            <CardHeader>
              <CardTitle>Owner</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{owner.user_name}</div>
                  <div className="text-sm text-muted-foreground">{owner.user_email}</div>
                </div>
                <div className="text-sm">Role: {owner.role}</div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Staff list */}
        <Card>
          <CardHeader>
            <CardTitle>Members</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {staff.length === 0 && (
                <div className="text-sm text-muted-foreground">No members yet.</div>
              )}
              {staff.map((m) => (
                <div key={m.user_email} className="flex items-center justify-between rounded-md border p-3">
                  <div>
                    <div className="font-medium">{m.user_name}</div>
                    <div className="text-sm text-muted-foreground">{m.user_email}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm">{m.role}</span>
                    <Link href={{ pathname: '/admin/practice-members/edit', query: { email: m.user_email } }}>
                      <Button size="sm" variant="outline">Edit</Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick add inline form */}
        {/* <Card>
          <CardHeader>
            <CardTitle>Add Member</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div className="space-y-2">
                <Label>Email</Label>
                <Input placeholder="jane@clinic.com" value={newMember.email} onChange={(e) => setNewMember(prev => ({ ...prev, email: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>Name</Label>
                <Input placeholder="Jane Doe" value={newMember.name} onChange={(e) => setNewMember(prev => ({ ...prev, name: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>Role</Label>
                <Select value={newMember.role} onValueChange={(v) => setNewMember(prev => ({ ...prev, role: v as any }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="STAFF">Staff</SelectItem>
                    <SelectItem value="ADMIN">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button type="submit" disabled={loading}>Create</Button>
              </div>
            </form>
            {formError && <p className="mt-2 text-sm text-red-500">{formError}</p>}
            {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
          </CardContent>
        </Card> */}
      </div>
    </AdminPortalLayout>
  )
}

