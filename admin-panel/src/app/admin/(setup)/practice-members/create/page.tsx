"use client"

import React, { useState } from 'react'
import AdminPortalLayout from '@/app/admin/_components/AdminPortalLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { usePracticeMembers, AddMemberPayload } from '../hooks/usePracticeMembers'
import Link from 'next/link'

export default function CreateMemberPage() {
  const { addMember, loading, error } = usePracticeMembers()
  const [payload, setPayload] = useState<AddMemberPayload>({ email: '', name: '', role: 'STAFF' })
  const [formError, setFormError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)
    if (!payload.email) {
      setFormError('Email is required')
      return
    }
    try {
      await addMember(payload)
      window.location.href = '/admin/practice-members'
    } catch (e: any) {
      setFormError(e.message)
    }
  }

  return (
    <AdminPortalLayout>
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Add Practice Member</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Email</Label>
                <Input value={payload.email} onChange={(e) => setPayload(prev => ({ ...prev, email: e.target.value }))} placeholder="jane@clinic.com" />
              </div>
              <div className="space-y-2">
                <Label>Name</Label>
                <Input value={payload.name} onChange={(e) => setPayload(prev => ({ ...prev, name: e.target.value }))} placeholder="Jane Doe" />
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
            </div>
            <div className="flex gap-2">
              <Button type="submit" disabled={loading}>Create</Button>
              <Link href="/admin/(setup)/practice-members">
                <Button type="button" variant="outline">Cancel</Button>
              </Link>
            </div>
            {formError && <p className="text-sm text-red-500">{formError}</p>}
            {error && <p className="text-sm text-red-500">{error}</p>}
          </form>
        </CardContent>
      </Card>
    </AdminPortalLayout>
  )
}


