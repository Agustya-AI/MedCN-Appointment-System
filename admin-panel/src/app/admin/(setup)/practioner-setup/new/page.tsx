"use client";

import AdminPortalLayout from '@/app/admin/_components/AdminPortalLayout';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store';
import { setAllPractionersAssociatedWithPractice } from '@/store/practice';
import axios from '@/constants/apiUtils';
import { usePractitioners } from '@/app/admin/_hooks/usePracticeData';
import PractitionerBasicInfoComponent from '../_components/PractitionerBasicInfoComponent';
import PractitionerProfessionalInfoComponent from '../_components/PractitionerProfessionalInfoComponent';

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

export default function NewPractitionerPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { refetchPractitioners } = usePractitioners();
  
  const [basicInfoData, setBasicInfoData] = useState<BasicInfoData>({});
  const [professionalInfoData, setProfessionalInfoData] = useState<ProfessionalInfoData>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Map frontend field names to backend field names
  const mapFieldsToDatabase = (basicData: BasicInfoData, professionalData: ProfessionalInfoData) => {
    const mappedData: any = {};

    // Required fields
    if (basicData.display_name) mappedData.display_name = basicData.display_name;
    if (basicData.profession) mappedData.profession = basicData.profession;
    if (basicData.qualifications) mappedData.qualifications = basicData.qualifications;
    if (basicData.education) mappedData.education = basicData.education;
    if (basicData.languages_spoken) mappedData.languages_spoken = basicData.languages_spoken;

    // Optional fields
    if (basicData.gender) mappedData.gender = basicData.gender;
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

      // Validate required fields
      if (!basicInfoData.display_name || !basicInfoData.profession || !basicInfoData.qualifications || 
          !basicInfoData.education || !basicInfoData.languages_spoken) {
        throw new Error("Please fill in all required fields (Name, Profession, Qualifications, Education, Languages)");
      }

      // Map frontend fields to database field names
      const mappedData = mapFieldsToDatabase(basicInfoData, professionalInfoData);

      console.log('Creating practitioner with data:', mappedData);

      const { data } = await axios.post(
        "/practice/add-practitioner",
        mappedData,
        { params: { user_token: token } }
      );

      console.log('Practitioner created successfully:', data);
      
      // Refresh practitioners list
      refetchPractitioners();
      
      // Navigate back to practitioners list
      router.push('/admin/practioner-setup');
      
    } catch (err: any) {
      console.error('Create practitioner error:', err);
      setError(err.response?.data?.detail || err.message || "Failed to create practitioner");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminPortalLayout>
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Add New Practitioner</h1>
          <p className="text-gray-600 mt-2">Fill in the practitioner details below</p>
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
              {loading ? 'Creating...' : 'Create Practitioner'}
            </button>
          </div>
        </div>
      </div>
    </AdminPortalLayout>
  );
} 