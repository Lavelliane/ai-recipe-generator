'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import ImageUploader from './image-uploader';
import { Button } from '@heroui/react';
import { RecipeSuggestions } from '@/components/RecipeSuggestions';
import { useRecipe } from '@/store/use-recipe';
import { usePreferences } from '@/store/use-preferences';

type Step = {
    label: string;
    component: React.ReactNode;
}

export default function TabController() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const { recipes } = useRecipe();
    const { goal, dietaryPreferences, allergies } = usePreferences();
    console.log(goal, dietaryPreferences, allergies);
    
    
    const currentStep = Number(searchParams.get('step') || '1');
    const currentRecipeIndex = Number(searchParams.get('recipe') || '0');
    
    
    const steps: Step[] = [
        { 
            label: 'Upload Image', 
            component: <ImageUploader onImageUploaded={() => {
                
                goToStep(2);
            }} />
        },
        { 
            label: 'Recipe Details', 
            component: <RecipeSuggestions currentRecipeIndex={currentRecipeIndex} />
        },
    ];
    
    
    const goToStep = (step: number) => {
        const params = new URLSearchParams(searchParams);
        params.set('step', step.toString());
        if (step === 1) {
            params.delete('recipe');
        }
        router.push(`${pathname}?${params.toString()}`);
    };

    
    const nextRecipe = () => {
        if (currentRecipeIndex < recipes.length - 1) {
            const params = new URLSearchParams(searchParams);
            params.set('recipe', (currentRecipeIndex + 1).toString());
            router.push(`${pathname}?${params.toString()}`);
        }
    };

    
    const prevRecipe = () => {
        if (currentRecipeIndex > 0) {
            const params = new URLSearchParams(searchParams);
            params.set('recipe', (currentRecipeIndex - 1).toString());
            router.push(`${pathname}?${params.toString()}`);
        }
    };
    
    
    const progress = ((currentStep - 1) / (steps.length - 1)) * 100;
    
    return (
        <div className="w-full max-w-4xl">
            
            <div className="w-full h-2 bg-gray-200 rounded-full mb-6">
                <div 
                    className="h-full rounded-full transition-all duration-300"
                    style={{ width: `${progress}%`, backgroundColor: '#FFA725' }}
                />
            </div>

           
           <div>
            <h2 className='text-lg semi-bold justify-center text-center mt-10'>AI Recipe Generator</h2>
           </div>
           
            <div className="mt-6">
                {steps[currentStep - 1]?.component}
            </div>
            
          
            <div className="flex justify-between mt-6">
                {currentStep === 2 ? (
                    <>
                        <Button 
                            onClick={() => goToStep(1)} 
                            className="border border-gray-300"
                        >
                            Back to Upload
                        </Button>
                        <div className="flex gap-2">
                            <Button 
                                onClick={prevRecipe}
                                disabled={currentRecipeIndex === 0}
                                className="border border-gray-300"
                            >
                                Previous Recipe
                            </Button>
                            <Button 
                                onClick={nextRecipe}
                                disabled={currentRecipeIndex === recipes.length - 1}
                                style={{ backgroundColor: '#FFA725' }}
                            >
                                Next Recipe
                            </Button>
                        </div>
                    </>
                ) : (
                    <Button 
                        onClick={() => goToStep(1)} 
                        disabled={currentStep === 1}
                        className="border border-gray-300"
                    >
                        Back to Upload
                    </Button>
                )}
            </div>
        </div>
    );
}
