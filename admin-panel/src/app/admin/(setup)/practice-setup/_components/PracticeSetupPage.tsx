"use client";

import AdminPortalLayout from '@/app/admin/_components/AdminPortalLayout';
import React, { useState } from 'react'
import { TimingsOfHospitalComponent } from './PracticeSetupTimingsComponent';
import PracticeProfileComponent from './PracticeSetupProfileComponent';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { useRouter } from 'next/navigation';

export default function page() {
    const currentPracticeDetails = useSelector((state: RootState) => state.practiceService.currentPracticeDetails);
    const router = useRouter();     
    if (!currentPracticeDetails) {
        return (
            <AdminPortalLayout>
                <div className="flex flex-col items-center justify-center p-8">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">No Practice Found</h2>
                    <button 
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
                        onClick={() => {
                            router.push('/admin/practice-setup/create');
                        }}
                    >
                        Setup Practice
                    </button>
                </div>
            </AdminPortalLayout>
        );
    }

    return (
        <AdminPortalLayout>
            <div className="bg-white rounded-xl">
                <PracticeProfileComponent />
                <hr className="my-8 border-gray-200" />
                <TimingsOfHospitalComponent />
            </div>
        </AdminPortalLayout>
    )
}
