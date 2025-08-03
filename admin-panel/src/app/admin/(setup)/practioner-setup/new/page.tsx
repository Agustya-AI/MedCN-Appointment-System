"use client";

import AdminPortalLayout from '@/app/admin/_components/AdminPortalLayout';
import { useState, useRef } from 'react';
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
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [basicInfoData, setBasicInfoData] = useState<BasicInfoData>({});
  const [professionalInfoData, setProfessionalInfoData] = useState<ProfessionalInfoData>({});
  const [loading, setLoading] = useState(false);
  const [importLoading, setImportLoading] = useState(false);
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

  const handleFileImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (file.type !== 'application/pdf') {
      setError('Please select a PDF file');
      return;
    }

    try {
      setImportLoading(true);
      setError(null);

      const formData = new FormData();
      formData.append('file', file);

      console.log('Uploading file for AI processing:', file.name);

      const { data } = await axios.post('/ai/get-doctor-details-from-file', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('AI extracted data:', data);

      // Extract the first element from the array response
      const extractedData = Array.isArray(data) ? data[0] : data;
      
      if (!extractedData) {
        throw new Error('No practitioner data found in the uploaded file');
      }

      // Map the response to form fields
      const basicInfo: BasicInfoData = {};
      const professionalInfo: ProfessionalInfoData = {};

      // Map basic info fields
      if (extractedData.display_name) basicInfo.display_name = extractedData.display_name;
      if (extractedData.profession) basicInfo.profession = extractedData.profession;
      if (extractedData.qualifications) basicInfo.qualifications = extractedData.qualifications;
      if (extractedData.education) basicInfo.education = extractedData.education;
      if (extractedData.languages_spoken) basicInfo.languages_spoken = extractedData.languages_spoken;
      if (extractedData.gender) basicInfo.gender = extractedData.gender;

      // Map professional info fields
      if (extractedData.link_to_best_practice) professionalInfo.link_to_best_practice = extractedData.link_to_best_practice;
      if (extractedData.professional_statement) professionalInfo.professional_statement = extractedData.professional_statement;
      if (extractedData.professional_areas_of_interest) professionalInfo.professional_areas_of_interest = extractedData.professional_areas_of_interest;

      // Update form data
      setBasicInfoData(prev => ({ ...prev, ...basicInfo }));
      setProfessionalInfoData(prev => ({ ...prev, ...professionalInfo }));

      console.log('Form fields populated successfully');

    } catch (err: any) {
      console.error('File import error:', err);
      setError(err.response?.data?.detail || err.message || "Failed to import file");
    } finally {
      setImportLoading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleImportButtonClick = () => {
    fileInputRef.current?.click();
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
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Add New Practitioner</h1>
              <p className="text-gray-600 mt-2">Fill in the practitioner details below</p>
            </div>
            <div className="flex flex-col items-end space-y-2">
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                onChange={handleFileImport}
                style={{ display: 'none' }}
              />
              <button
                onClick={handleImportButtonClick}
                disabled={importLoading}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 flex items-center space-x-2"
              >
                {importLoading ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                    </svg>
                    <span>Import from file</span>
                  </>
                )}
              </button>
              <p className="text-xs text-gray-500">Upload PDF to auto-fill</p>
            </div>
          </div>
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