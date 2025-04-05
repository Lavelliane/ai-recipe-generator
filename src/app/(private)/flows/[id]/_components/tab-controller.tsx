'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import ImageUploader from './image-uploader';
import { Button } from '@heroui/react';
import RecipeGenerator from './recipe-generator';
import { RecipeSuggestions } from '@/components/RecipeSuggestions';

type Step = {
    label: string;
    component: React.ReactNode;
}

export default function TabController() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    
    // Get current step from search params or default to 1
    const currentStep = Number(searchParams.get('step') || '1');
    
    // Define steps
    const steps: Step[] = [
        { label: 'Upload Image', component: <ImageUploader /> },
        { label: 'Generate Recipe', component: <RecipeSuggestions /> },
        { label: 'Review Ingredients', component: <div>Review Ingredients Component</div> },
    ];
    
    // Navigate to a specific step
    const goToStep = (step: number) => {
        const params = new URLSearchParams(searchParams);
        params.set('step', step.toString());
        router.push(`${pathname}?${params.toString()}`);
    };
    
    // Go to next step
    const nextStep = () => {
        if (currentStep < steps.length) {
            goToStep(currentStep + 1);
        }
    };
    
    // Go to previous step
    const prevStep = () => {
        if (currentStep > 1) {
            goToStep(currentStep - 1);
        }
    };
    
    return (
        <div className="w-full max-w-4xl">
            {/* Stepper header */}
            <div className="flex justify-between mb-6">
                {steps.map((step, index) => (
                    <div key={index} className="flex items-center">
                        <div 
                            className={`h-8 w-8 rounded-full flex items-center justify-center ${
                                index + 1 === currentStep 
                                    ? 'bg-blue-600 text-white' 
                                    : index + 1 < currentStep 
                                        ? 'bg-green-500 text-white' 
                                        : 'bg-gray-200 text-gray-700'
                            }`}
                        >
                            {index + 1}
                        </div>
                        <span className="ml-2 text-sm">{step.label}</span>
                        {index < steps.length - 1 && (
                            <div className="w-12 h-1 bg-gray-200 mx-2"></div>
                        )}
                    </div>
                ))}
            </div>
            
            {/* Step content */}
            <div className="mt-6">
                {steps[currentStep - 1]?.component}
            </div>
            
            {/* Navigation buttons */}
            <div className="flex justify-between mt-6">
                <Button 
                    onClick={prevStep} 
                    disabled={currentStep === 1}
                    className="border border-gray-300"
                >
                    Previous
                </Button>
                <Button 
                    onClick={nextStep} 
                    disabled={currentStep === steps.length}
                >
                    {currentStep === steps.length ? 'Finish' : 'Next'}
                </Button>
            </div>
        </div>
    );
}
