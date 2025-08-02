"use client";

import AdminPortalLayout from '@/app/admin/_components/AdminPortalLayout';
import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react'
import { TimingsOfHospitalComponent } from './PracticeSetupTimingsComponent';
import PracticeProfileComponent from './PracticeSetupProfileComponent';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { useRouter } from 'next/navigation';
import { setCurrentPracticeDetails } from '@/store/practice';
import axios from '@/constants/apiUtils';

export default function page() {
    const currentPracticeDetails = useSelector((state: RootState) => state.practiceService.currentPracticeDetails);
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    // State for tracking form changes
    const [practiceData, setPracticeData] = useState<any>(null);
    const [timingsData, setTimingsData] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [hasChanges, setHasChanges] = useState(false);

    const isInitialized = useRef(false);

    const refreshPracticeData = useCallback(async () => {
        try {
            const token = localStorage.getItem("auth_token");
            if (!token) {
                throw new Error("Authentication token not found");
            }

            const { data } = await axios.get(
                "/practice/current-practice-details",
                { params: { user_token: token } }
            );
            
            dispatch(setCurrentPracticeDetails(data));
            console.log('Practice data refreshed from backend');
            
        } catch (err) {
            console.error('Failed to refresh practice data:', err);
            // Don't throw here as this is called after successful save
        }
    }, [dispatch]);

    // Map database fields back to frontend field names - memoized properly
    const mapDatabaseToFrontend = useMemo(() => {
        if (!currentPracticeDetails) return { practiceData: {}, timingsData: {} };

        const practiceData = {
            practice_name: currentPracticeDetails.practice_name || '',
            phone_number: currentPracticeDetails.phone_number || '',
            website: currentPracticeDetails.practice_website || '',
            accreditation: currentPracticeDetails.practice_accrediation || '',
            about_practice: currentPracticeDetails.about_practice || '',
            facilities: currentPracticeDetails.facilities || [],
            wheelchair_access: currentPracticeDetails.wheel_chair_access || false,
            // Extract social media links from JSON
            facebook_url: currentPracticeDetails.social_media_links?.facebook || '',
            twitter_url: currentPracticeDetails.social_media_links?.twitter || '',
        };

        const timingsData = {
            opening_hours: currentPracticeDetails.opening_hours || {},
            exceptions: currentPracticeDetails.exceptions || [],
            alert_message: currentPracticeDetails.alert_message || '',
        };

        return { practiceData, timingsData };
    }, [currentPracticeDetails]);

    // Initialize form data when currentPracticeDetails loads
    useEffect(() => {
        if (currentPracticeDetails) {
            const mappedData = mapDatabaseToFrontend;
            setPracticeData(mappedData.practiceData);
            setTimingsData(mappedData.timingsData);
            
            // Only set initialized to true after a brief delay to ensure children receive the data
            setTimeout(() => {
                isInitialized.current = true;
            }, 100);
            
            setHasChanges(false);
            console.log('Initializing with data:', mappedData); // Debug log
        }
    }, [currentPracticeDetails, mapDatabaseToFrontend]);

    // Map frontend field names to database field names (same as create page)
    const mapFieldsToDatabase = useCallback((frontendData: any, timingData: any) => {
        const mappedData: any = {};

        // Map practice profile fields
        if (frontendData.practice_name) mappedData.practice_name = frontendData.practice_name;
        if (frontendData.phone_number) mappedData.phone_number = frontendData.phone_number;
        if (frontendData.website) mappedData.practice_website = frontendData.website;
        if (frontendData.accreditation) mappedData.practice_accrediation = frontendData.accreditation;
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
    }, []);

    const handlePracticeDataChange = useCallback((data: any) => {
        if (!isInitialized.current) return; // Prevent changes during initialization
        
        console.log('Practice data changed:', data); // Debug log
        setPracticeData(data);
        setHasChanges(true);
        setError(null);
    }, []);

    const handleTimingsDataChange = useCallback((data: any) => {
        if (!isInitialized.current) return; // Prevent changes during initialization
        
        console.log('Timings data changed:', data); // Debug log
        setTimingsData(data);
        setHasChanges(true);
        setError(null);
    }, []);

    const handleSave = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const token = localStorage.getItem("auth_token");
            if (!token) {
                throw new Error("Authentication token not found");
            }

            // Map frontend fields to database field names
            const mappedData = mapFieldsToDatabase(practiceData, timingsData);

            console.log('Saving practice changes:', mappedData);

            const { data } = await axios.put(
                "/practice/edit-practice-details",
                mappedData,
                { params: { user_token: token } }
            );

            console.log('Practice updated successfully! Response:', data);
            
            // Reset change tracking
            setHasChanges(false);
            isInitialized.current = false; // Reset to allow re-initialization
            
            // Refresh practice data from backend to get latest complete data
            await refreshPracticeData();
            
            // Show success message (you could add a toast notification here)
            console.log('Practice data refreshed from backend');
            
        } catch (err: any) {
            console.error('Save practice error:', err);
            setError(err.response?.data?.detail || err.message || "Failed to save practice changes");
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = useCallback(() => {
        // Reset to original data from Redux
        const mappedData = mapDatabaseToFrontend;
        setPracticeData(mappedData.practiceData);
        setTimingsData(mappedData.timingsData);
        setHasChanges(false);
        setError(null);
    }, [mapDatabaseToFrontend]);

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

    // Don't render the form until we have the data initialized
    if (!practiceData || !timingsData) {
        return (
            <AdminPortalLayout>
                <div className="flex items-center justify-center p-8">
                    <div className="text-gray-600">Loading practice details...</div>
                </div>
            </AdminPortalLayout>
        );
    }

    return (
        <AdminPortalLayout>
            <div className="bg-white rounded-xl">
                {/* Error Message */}
                {error && (
                    <div className="mx-6 mt-6 p-4 bg-red-50 border border-red-200 rounded-md">
                        <p className="text-red-800">{error}</p>
                    </div>
                )}

                <PracticeProfileComponent 
                    initialData={practiceData}
                    onChange={handlePracticeDataChange}
                />
                <hr className="my-8 border-gray-200" />
                <TimingsOfHospitalComponent 
                    initialData={timingsData}
                    onChange={handleTimingsDataChange}
                />
                
                {/* Save Button for Edit Mode */}
                <div className="p-6 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                        {hasChanges && (
                            <p className="text-sm text-yellow-600">
                                You have unsaved changes
                            </p>
                        )}
                        <div className="flex justify-end space-x-4 ml-auto">
                            {hasChanges && (
                                <button 
                                    className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                                    onClick={handleCancel}
                                    disabled={loading}
                                >
                                    Cancel
                                </button>
                            )}
                            <button 
                                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                                onClick={handleSave}
                                disabled={loading || !hasChanges}
                            >
                                {loading ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </AdminPortalLayout>
    )
}
