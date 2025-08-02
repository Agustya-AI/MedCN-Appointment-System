"use client";

import { useState, useEffect, useRef } from "react";

interface PractitionerProfessionalInfoData {
    link_to_best_practice?: string;
    professional_statement?: string;
    professional_areas_of_interest?: { [key: string]: boolean };
}

interface PractitionerProfessionalInfoComponentProps {
    initialData?: PractitionerProfessionalInfoData;
    onChange?: (data: PractitionerProfessionalInfoData) => void;
}

export default function PractitionerProfessionalInfoComponent({ 
    initialData = {}, 
    onChange 
}: PractitionerProfessionalInfoComponentProps) {
    const [formData, setFormData] = useState<PractitionerProfessionalInfoData>(initialData);
    const [selectedAreas, setSelectedAreas] = useState<string[]>([]);

    // Use ref to track initialization and prevent initial onChange calls
    const isInitializing = useRef(true);
    const prevInitialDataRef = useRef(initialData);

    // Available areas of interest
    const availableAreas = [
        'Cardiology',
        'Dermatology',
        'Endocrinology',
        'Gastroenterology',
        'Geriatrics',
        'Hematology',
        'Infectious Disease',
        'Nephrology',
        'Neurology',
        'Oncology',
        'Orthopedics',
        'Pediatrics',
        'Psychiatry',
        'Pulmonology',
        'Radiology',
        'Surgery',
        'Urology',
        'Emergency Medicine',
        'Family Medicine',
        'Internal Medicine'
    ];

    // Only update local state if initialData actually changed
    useEffect(() => {
        const hasChanged = JSON.stringify(prevInitialDataRef.current) !== JSON.stringify(initialData);

        if (hasChanged) {
            isInitializing.current = true;
            setFormData(initialData);
            
            // Initialize selected areas from data
            if (initialData.professional_areas_of_interest) {
                const areas = Object.keys(initialData.professional_areas_of_interest).filter(
                    key => initialData.professional_areas_of_interest![key]
                );
                setSelectedAreas(areas);
            }
            
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

    const updateFormData = (field: keyof PractitionerProfessionalInfoData, value: any) => {
        const newData = { ...formData, [field]: value };
        setFormData(newData);
    };

    const toggleAreaOfInterest = (area: string) => {
        const newSelectedAreas = selectedAreas.includes(area) 
            ? selectedAreas.filter(a => a !== area)
            : [...selectedAreas, area];
        
        setSelectedAreas(newSelectedAreas);
        
        // Convert to object format for backend
        const areasObject = newSelectedAreas.reduce((acc, area) => {
            acc[area] = true;
            return acc;
        }, {} as { [key: string]: boolean });
        
        updateFormData('professional_areas_of_interest', areasObject);
    };

    return (
        <div className="container mx-auto p-6">
            <div className="space-y-6">
                <h2 className="text-2xl font-bold">Professional Information</h2>
                
                <div className="space-y-6">
                    <div>
                        <label className="text-sm font-medium text-gray-700">
                            Link to Best Practice Guidelines
                        </label>
                        <input
                            type="url"
                            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="https://example.com/guidelines"
                            value={formData.link_to_best_practice || ''}
                            onChange={(e) => updateFormData('link_to_best_practice', e.target.value)}
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Optional: Link to professional guidelines or best practices
                        </p>
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-700">
                            Professional Statement
                        </label>
                        <textarea
                            className="w-full px-3 py-2 border rounded-md h-32 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                            placeholder="Describe your professional background, expertise, and approach to patient care..."
                            value={formData.professional_statement || ''}
                            onChange={(e) => updateFormData('professional_statement', e.target.value)}
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Optional: Brief statement about your professional background and expertise
                        </p>
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-700 block mb-3">
                            Professional Areas of Interest
                        </label>
                        <p className="text-xs text-gray-500 mb-4">
                            Select the medical specialties or areas of interest (optional)
                        </p>
                        
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                            {availableAreas.map((area) => (
                                <label 
                                    key={area} 
                                    className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
                                >
                                    <input
                                        type="checkbox"
                                        checked={selectedAreas.includes(area)}
                                        onChange={() => toggleAreaOfInterest(area)}
                                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                    />
                                    <span className="text-sm text-gray-700">{area}</span>
                                </label>
                            ))}
                        </div>

                        {selectedAreas.length > 0 && (
                            <div className="mt-4">
                                <p className="text-sm font-medium text-gray-700 mb-2">Selected areas:</p>
                                <div className="flex flex-wrap gap-2">
                                    {selectedAreas.map((area) => (
                                        <span 
                                            key={area}
                                            className="inline-flex items-center bg-blue-50 text-blue-700 px-2 py-1 rounded-md text-sm"
                                        >
                                            {area}
                                            <button
                                                type="button"
                                                className="ml-1 hover:text-blue-900"
                                                onClick={() => toggleAreaOfInterest(area)}
                                            >
                                                ×
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
} 