"use client";

import AdminPortalLayout from '@/app/admin/_components/AdminPortalLayout';
import { useState, useEffect, useMemo } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import axiosInstance from '@/constants/apiUtils';
import { usePractitioners } from '@/app/admin/_hooks/usePracticeData';
import PractitionerBasicInfoComponent from '../../_components/PractitionerBasicInfoComponent';
import PractitionerProfessionalInfoComponent from '../../_components/PractitionerProfessionalInfoComponent';
import PractitionerAvailabilityComponent from '../../_components/PractitionerAvailabilityComponent';

// Type definitions for form data
interface BasicInfoData {
  display_name?: string;
  profession?: string;
  qualifications?: string;
  education?: string;
  languages_spoken?: string;
  gender?: string;
}

interface ProfessionalInfoData {
  link_to_best_practice?: string;
  professional_statement?: string;
  professional_areas_of_interest?: { [key: string]: boolean };
}

interface AvailabilitySlot {
  availability_uuid?: string;
  day_of_week: string;
  day_name: string;
  start_time: string;
  end_time: string;
  is_active: boolean;
}

export default function EditPractitionerPage() {
  const router = useRouter();
  const params = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const { practitioners, refetchPractitioners } = usePractitioners();
  
  const practitioner_uuid = params.practitioner_uuid as string;
  
  const [basicInfoData, setBasicInfoData] = useState<BasicInfoData>({});
  const [professionalInfoData, setProfessionalInfoData] = useState<ProfessionalInfoData>({});
  const [availabilityData, setAvailabilityData] = useState<AvailabilitySlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Find the practitioner from the Redux store
  const currentPractitioner = useMemo(() => {
    return practitioners.find(p => p.practitioner_uuid === practitioner_uuid);
  }, [practitioners, practitioner_uuid]);

  // Map database fields back to frontend field names
  const mapDatabaseToFrontend = useMemo(() => {
    if (!currentPractitioner) return { basicInfoData: {}, professionalInfoData: {} };

    const basicInfoData: BasicInfoData = {
      display_name: currentPractitioner.display_name || '',
      profession: currentPractitioner.profession || '',
      qualifications: currentPractitioner.qualifications || '',
      education: currentPractitioner.education || '',
      languages_spoken: currentPractitioner.languages_spoken || '',
      gender: currentPractitioner.gender || '',
    };

    const professionalInfoData: ProfessionalInfoData = {
      link_to_best_practice: currentPractitioner.link_to_best_practice || '',
      professional_statement: currentPractitioner.professional_statement || '',
      professional_areas_of_interest: currentPractitioner.professional_areas_of_interest || {},
    };

    return { basicInfoData, professionalInfoData };
  }, [currentPractitioner]);

  // Initialize form data when practitioner loads
  useEffect(() => {
    if (currentPractitioner && !isInitialized) {
      const mappedData = mapDatabaseToFrontend;
      setBasicInfoData(mappedData.basicInfoData);
      setProfessionalInfoData(mappedData.professionalInfoData);
      setIsInitialized(true);
      console.log('Initializing edit form with data:', mappedData);
    }
  }, [currentPractitioner, mapDatabaseToFrontend, isInitialized]);

  // Map frontend field names to backend field names
  const mapFieldsToDatabase = (basicData: BasicInfoData, professionalData: ProfessionalInfoData) => {
    const mappedData: any = {};

    // Basic info fields (all optional for update)
    if (basicData.display_name) mappedData.display_name = basicData.display_name;
    if (basicData.profession) mappedData.profession = basicData.profession;
    if (basicData.qualifications) mappedData.qualifications = basicData.qualifications;
    if (basicData.education) mappedData.education = basicData.education;
    if (basicData.languages_spoken) mappedData.languages_spoken = basicData.languages_spoken;
    if (basicData.gender) mappedData.gender = basicData.gender;

    // Professional info fields
    if (professionalData.link_to_best_practice) mappedData.link_to_best_practice = professionalData.link_to_best_practice;
    if (professionalData.professional_statement) mappedData.professional_statement = professionalData.professional_statement;
    if (professionalData.professional_areas_of_interest) mappedData.professional_areas_of_interest = professionalData.professional_areas_of_interest;

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
      const mappedData = mapFieldsToDatabase(basicInfoData, professionalInfoData);

      console.log('Updating practitioner with data:', mappedData);

      const { data } = await axiosInstance.put(
        "/practice/edit-practitioner",
        mappedData,
        { 
          params: { 
            user_token: token,
            practitioner_uuid: practitioner_uuid
          } 
        }
      );

      console.log('Practitioner updated successfully:', data);
      
      // Refresh practitioners list
      refetchPractitioners();
      
      // Navigate back to practitioners list
      router.push('/admin/practioner-setup');
      
    } catch (err: any) {
      console.error('Update practitioner error:', err);
      setError(err.response?.data?.detail || err.message || "Failed to update practitioner");
    } finally {
      setLoading(false);
    }
  };

  // Loading state while fetching practitioner
  if (!currentPractitioner && practitioners.length === 0) {
    return (
      <AdminPortalLayout>
        <div className="flex items-center justify-center p-8">
          <div className="text-gray-600">Loading practitioner details...</div>
        </div>
      </AdminPortalLayout>
    );
  }

  // Practitioner not found
  if (!currentPractitioner && practitioners.length > 0) {
    return (
      <AdminPortalLayout>
        <div className="max-w-4xl mx-auto p-6">
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <h2 className="text-2xl font-semibold text-gray-800">Practitioner Not Found</h2>
            <p className="text-gray-600">The practitioner you're looking for doesn't exist.</p>
            <button
              onClick={() => router.push('/admin/practioner-setup')}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Back to Practitioners
            </button>
          </div>
        </div>
      </AdminPortalLayout>
    );
  }

  return (
    <AdminPortalLayout>
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Edit Practitioner</h1>
          <p className="text-gray-600 mt-2">
            Update details for {currentPractitioner?.display_name}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        <div className="space-y-8">
          <div className="bg-white rounded-lg shadow-sm border">
            <PractitionerBasicInfoComponent 
              initialData={basicInfoData} 
              onChange={setBasicInfoData} 
            />
          </div>

          <div className="bg-white rounded-lg shadow-sm border">
            <PractitionerProfessionalInfoComponent 
              initialData={professionalInfoData} 
              onChange={setProfessionalInfoData} 
            />
          </div>

          <div className="bg-white rounded-lg shadow-sm border">
            <PractitionerAvailabilityComponent 
              practitioner_uuid={practitioner_uuid}
              initialAvailability={availabilityData}
              onAvailabilityChange={setAvailabilityData}
              isEditMode={true}
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
              {loading ? 'Updating...' : 'Update Practitioner'}
            </button>
          </div>
        </div>
      </div>
    </AdminPortalLayout>
  );
} 