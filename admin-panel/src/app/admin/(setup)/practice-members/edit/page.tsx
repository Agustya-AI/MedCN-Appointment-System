import React from 'react'
import EditMemberPage from './EditPracticePage'
import { Suspense } from "react";

export default function page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>

    <EditMemberPage></EditMemberPage>
    </Suspense>
  )
}
