"use client";

import AdminPortalLayout from '@/app/admin/_components/AdminPortalLayout';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store';
import { setCurrentPracticeDetails } from '@/store/practice';
import axios from '@/constants/apiUtils';
import usePracticeData from '@/app/admin/_hooks/usePracticeData';
import PracticeProfileComponent from '../_components/PracticeSetupProfileComponent';
import { TimingsOfHospitalComponent } from '../_components/PracticeSetupTimingsComponent';

export default function CreatePracticePage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { practice, loading: practiceLoading } = usePracticeData();
  
  const [practiceData, setPracticeData] = useState({});
  const [timingsData, setTimingsData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Map frontend field names to database field names
  const mapFieldsToDatabase = (frontendData: any, timingData: any) => {
    const mappedData: any = {};

    // Map practice profile fields
    if (frontendData.practice_name) mappedData.practice_name = frontendData.practice_name;
    if (frontendData.phone_number) mappedData.phone_number = frontendData.phone_number;
    if (frontendData.website) mappedData.practice_website = frontendData.website;
    if (frontendData.accreditation) mappedData.practice_accrediation = frontendData.accreditation; // Note: typo in model
    if (frontendData.about_practice) mappedData.about_practice = frontendData.about_practice;
    if (frontendData.facilities) mappedData.facilities = frontendData.facilities;
    if (frontendData.wheelchair_access !== undefined) mappedData.wheel_chair_access = frontendData.wheelchair_access;

    // Map social media links to JSON structure
    if (frontendData.facebook_url || frontendData.twitter_url) {
      mappedData.social_media_links = {
        facebook: frontendData.facebook_url || '',
        twitter: frontendData.twitter_url || ''
      };
    }

    // Map timing fields
    if (timingData.opening_hours) mappedData.opening_hours = timingData.opening_hours;
    if (timingData.exceptions) mappedData.exceptions = timingData.exceptions;
    if (timingData.alert_message) mappedData.alert_message = timingData.alert_message;

    return mappedData;
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem("auth_token");
      if (!token) {
        throw new Error("Authentication token not found");
      }

      // Map frontend fields to database field names
      const mappedData = mapFieldsToDatabase(practiceData, timingsData);

      console.log('Sending mapped data:', mappedData); // Debug log

      const { data } = await axios.post(
        "/practice/add-practice-setup",
        mappedData,
        { params: { user_token: token } }
      );

      // Update Redux store
      dispatch(setCurrentPracticeDetails(data));
      
      // Navigate to practice setup page
      router.push('/admin/practice-setup');
      
    } catch (err: any) {
      console.error('Create practice error:', err); // Debug log
      setError(err.response?.data?.detail || err.message || "Failed to create practice");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminPortalLayout>
      <div className="max-w-6xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create Practice Setup</h1>
          <p className="text-gray-600 mt-2">Set up your practice profile and operating hours</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        <div className="space-y-8">
          <div className="bg-white rounded-lg shadow-sm border">
            <PracticeProfileComponent 
              initialData={practiceData} 
              onChange={setPracticeData} 
            />
          </div>

          <div className="bg-white rounded-lg shadow-sm border">
            <TimingsOfHospitalComponent 
              initialData={timingsData} 
              onChange={setTimingsData} 
            />
          </div>

          <div className="flex justify-end space-x-4">
            <button
              onClick={() => router.back()}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Practice'}
            </button>
          </div>
        </div>
      </div>
    </AdminPortalLayout>
  );
}
