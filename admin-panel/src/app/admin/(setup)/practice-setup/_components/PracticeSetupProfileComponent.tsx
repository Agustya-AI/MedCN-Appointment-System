"use client";

import { useState, useEffect, useRef } from "react";

interface PracticeProfileData {
    practice_name?: string;
    phone_number?: string;
    website?: string;
    accreditation?: string;
    facebook_url?: string;
    twitter_url?: string;
    facilities?: string[];
    about_practice?: string;
    wheelchair_access?: boolean;
}

interface PracticeProfileComponentProps {
    initialData?: PracticeProfileData;
    onChange?: (data: PracticeProfileData) => void;
}

export default function PracticeProfileComponent({ 
    initialData = {}, 
    onChange 
}: PracticeProfileComponentProps) {
    const [selectedFacilities, setSelectedFacilities] = useState<string[]>(initialData.facilities || []);
    const [formData, setFormData] = useState<PracticeProfileData>(initialData);

    // Use ref to track if component is initializing
    const isInitializing = useRef(true);
    const prevInitialDataRef = useRef(initialData);

    // Only update local state if initialData actually changed
    useEffect(() => {
        const hasChanged = JSON.stringify(prevInitialDataRef.current) !== JSON.stringify(initialData);

        if (hasChanged) {
            isInitializing.current = true;
            setFormData(initialData);
            setSelectedFacilities(initialData.facilities || []);
            prevInitialDataRef.current = initialData;
        }
    }, [initialData]);

    // Call onChange only after initialization and when user makes changes
    useEffect(() => {
        if (isInitializing.current) {
            isInitializing.current = false;
            return;
        }

        onChange?.(formData);
    }, [formData, onChange]);

    const updateFormData = (field: keyof PracticeProfileData, value: any) => {
        const newData = { ...formData, [field]: value };
        setFormData(newData);
    };

    const handleFacilityChange = (facilities: string[]) => {
        setSelectedFacilities(facilities);
        updateFormData('facilities', facilities);
    };

    return (
        <div className="container mx-auto p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Column - Practice Details */}
                <div className="space-y-6">
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold">Practice Profile</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium">Practice Name</label>
                                <input
                                    type="text"
                                    className="w-full px-3 py-2 border rounded-md"
                                    placeholder="Enter practice name"
                                    value={formData.practice_name || ''}
                                    onChange={(e) => updateFormData('practice_name', e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium">Phone Number</label>
                                <input
                                    type="tel"
                                    className="w-full px-3 py-2 border rounded-md"
                                    placeholder="Enter phone number"
                                    value={formData.phone_number || ''}
                                    onChange={(e) => updateFormData('phone_number', e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium">Website</label>
                                <input
                                    type="url"
                                    className="w-full px-3 py-2 border rounded-md"
                                    placeholder="Enter website URL"
                                    value={formData.website || ''}
                                    onChange={(e) => updateFormData('website', e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium">Accreditation</label>
                                <select 
                                    className="w-full px-3 py-2 border rounded-md"
                                    value={formData.accreditation || ''}
                                    onChange={(e) => updateFormData('accreditation', e.target.value)}
                                >
                                    <option value="">Please choose accreditation body</option>
                                    <option value="AGPAL">AGPAL</option>
                                    <option value="QIP">QIP</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-sm font-medium">Social Media Links</label>
                                <input
                                    type="url"
                                    className="w-full px-3 py-2 border rounded-md mb-2"
                                    placeholder="Facebook URL"
                                    value={formData.facebook_url || ''}
                                    onChange={(e) => updateFormData('facebook_url', e.target.value)}
                                />
                                <input
                                    type="url"
                                    className="w-full px-3 py-2 border rounded-md"
                                    placeholder="Twitter URL"
                                    value={formData.twitter_url || ''}
                                    onChange={(e) => updateFormData('twitter_url', e.target.value)}
                                />
                            </div>

                        </div>
                    </div>
                </div>

                {/* Right Column - Image Upload & About */}
                <div className="space-y-6">
                    <div>
                        <label className="text-sm font-medium">Facilities</label>
                        <div className="relative">
                            <select
                                className="w-full px-3 py-2 border rounded-md"
                                onChange={(e) => {
                                    if (e.target.value) {
                                        // Add new facility chip
                                        const newFacility = e.target.value;
                                        const updatedFacilities = [...selectedFacilities, newFacility];
                                        handleFacilityChange(updatedFacilities);
                                        e.target.value = ''; // Reset select
                                    }
                                }}
                            >
                                <option value="">Select a facility</option>
                                <option value="Onsite Pathology">Onsite Pathology</option>
                                <option value="Onsite Allied Health">Onsite Allied Health</option>
                                <option value="Onsite Radiology">Onsite Radiology</option>
                                <option value="Onsite Pharmacy">Onsite Pharmacy</option>
                                <option value="Pathology Nearby">Pathology Nearby</option>
                                <option value="Allied Health Nearby">Allied Health Nearby</option>
                                <option value="Radiology Nearby">Radiology Nearby</option>
                                <option value="Pharmacy Nearby">Pharmacy Nearby</option>
                            </select>

                            <div className="mt-2 flex flex-wrap gap-2">
                                {selectedFacilities?.map((facility, index) => (
                                    <div key={index} className="inline-flex items-center bg-blue-50 text-blue-700 px-2 py-1 rounded-md">
                                        <span>{facility}</span>
                                        <button
                                            className="ml-1 hover:text-blue-900"
                                            onClick={() => {
                                                const updatedFacilities = selectedFacilities.filter((_, i) => i !== index);
                                                handleFacilityChange(updatedFacilities);
                                            }}
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="text-sm font-medium">About your Practice</label>
                        <textarea
                            className="w-full px-3 py-2 border rounded-md h-32"
                            placeholder="Enter description about your practice"
                            value={formData.about_practice || ''}
                            onChange={(e) => updateFormData('about_practice', e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium">Facilities</label>
                        <div className="grid grid-cols-2 gap-2">
                            <label className="flex items-center space-x-2">
                                <input 
                                    type="checkbox" 
                                    checked={formData.wheelchair_access || false}
                                    onChange={(e) => updateFormData('wheelchair_access', e.target.checked)}
                                />
                                <span>Wheelchair Access</span>
                            </label>
                            {/* Add more facility checkboxes as needed */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
