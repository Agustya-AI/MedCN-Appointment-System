"use client";

import { useState, useEffect, useRef } from "react";

interface PractitionerBasicInfoData {
    display_name?: string;
    profession?: string;
    qualifications?: string;
    education?: string;
    languages_spoken?: string;
    gender?: string;
}

interface PractitionerBasicInfoComponentProps {
    initialData?: PractitionerBasicInfoData;
    onChange?: (data: PractitionerBasicInfoData) => void;
}

export default function PractitionerBasicInfoComponent({ 
    initialData = {}, 
    onChange 
}: PractitionerBasicInfoComponentProps) {
    const [formData, setFormData] = useState<PractitionerBasicInfoData>(initialData);

    // Use ref to track initialization and prevent initial onChange calls
    const isInitializing = useRef(true);
    const prevInitialDataRef = useRef(initialData);

    // Only update local state if initialData actually changed
    useEffect(() => {
        const hasChanged = JSON.stringify(prevInitialDataRef.current) !== JSON.stringify(initialData);

        if (hasChanged) {
            isInitializing.current = true;
            setFormData(initialData);
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

    const updateFormData = (field: keyof PractitionerBasicInfoData, value: any) => {
        const newData = { ...formData, [field]: value };
        setFormData(newData);
    };

    return (
        <div className="container mx-auto p-6">
            <div className="space-y-6">
                <h2 className="text-2xl font-bold">Basic Information</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Left Column */}
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium text-gray-700">
                                Display Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Enter practitioner name"
                                value={formData.display_name || ''}
                                onChange={(e) => updateFormData('display_name', e.target.value)}
                            />
                        </div>
                        
                        <div>
                            <label className="text-sm font-medium text-gray-700">
                                Profession <span className="text-red-500">*</span>
                            </label>
                            <select 
                                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                value={formData.profession || ''}
                                onChange={(e) => updateFormData('profession', e.target.value)}
                            >
                                <option value="">Select profession</option>
                                <option value="Doctor">Doctor</option>
                                <option value="Nurse">Nurse</option>
                                <option value="Specialist">Specialist</option>
                                <option value="Therapist">Therapist</option>
                                <option value="Surgeon">Surgeon</option>
                                <option value="Dentist">Dentist</option>
                                <option value="Pharmacist">Pharmacist</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-700">
                                Qualifications <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="e.g., MBBS, MD, PhD"
                                value={formData.qualifications || ''}
                                onChange={(e) => updateFormData('qualifications', e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium text-gray-700">
                                Education <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="University/Institution name"
                                value={formData.education || ''}
                                onChange={(e) => updateFormData('education', e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-700">
                                Languages Spoken <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="e.g., English, Spanish, French"
                                value={formData.languages_spoken || ''}
                                onChange={(e) => updateFormData('languages_spoken', e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-700">Gender</label>
                            <select 
                                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                value={formData.gender || ''}
                                onChange={(e) => updateFormData('gender', e.target.value)}
                            >
                                <option value="">Select gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                                <option value="Prefer not to say">Prefer not to say</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="text-sm text-gray-500">
                    <span className="text-red-500">*</span> Required fields
                </div>
            </div>
        </div>
    );
} 