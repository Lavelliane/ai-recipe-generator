'use client';

import { Input } from "@heroui/react";
import { useState, type ChangeEvent, useEffect } from "react";
import { extractIngredientsFromImage } from "@/actions/ingredients/action";
import { useRecipe } from "@/store/use-recipe";
import { usePreferences } from "@/store/use-preferences";

interface ImageUploaderProps {
    onImageUploaded?: () => void;
}

export default function ImageUploader({ onImageUploaded }: ImageUploaderProps) {
    const [file, setFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState("Processing your image...");
    const [loadingProgress, setLoadingProgress] = useState(0);
    const { setIngredients, generateRecipes } = useRecipe();
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { goal, dietaryPreferences, allergies } = usePreferences();
    
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setError(null); 
        }
    };

    useEffect(() => {
        async function processImage() {
            if (file && !isProcessing) {
                try {
                    setIsProcessing(true);
                    setIsLoading(true);
                    setLoadingProgress(0);
                    setLoadingMessage("Analyzing your image...");
                    setError(null);
                    
                    
                    const formData = new FormData();
                    formData.append("image", file);
                    const result = await extractIngredientsFromImage(formData);
                    
                   
                    console.log("Extracted ingredients:", result.ingredients);
                    setIngredients(result.ingredients);
                    
                    
                    setLoadingProgress(33);
                    setLoadingMessage("Extracting ingredients...");
                    
                    
                    await new Promise(resolve => setTimeout(resolve, 500));
                    
                    
                    setLoadingProgress(66);
                    setLoadingMessage("Generating delicious recipes...");
                    await generateRecipes(result.ingredients, {
                        goal: goal,
                        dietaryPreferences: dietaryPreferences,
                        allergies: allergies
                    });
                    
                    
                    setLoadingProgress(100);
                    setLoadingMessage("Almost ready...");
                    
                   
                    await new Promise(resolve => setTimeout(resolve, 500));
                    
                    
                    onImageUploaded?.();
                } catch (error) {
                    console.error('Error processing image:', error);
                    setError(error instanceof Error ? error.message : "Error processing image. Please try again.");
                    setLoadingMessage("Error processing image. Please try again.");
                } finally {
                    setIsLoading(false);
                    setIsProcessing(false);
                }
            }
        }
        processImage();
    }, [file, onImageUploaded, generateRecipes, isProcessing]);

    return (
        <div className="flex flex-col items-center justify-center w-full">
            {isLoading ? (
                <div className="flex flex-col items-center justify-center w-full h-64">
                    <div 
                        className="animate-spin rounded-full h-12 w-12 border-b-2 mb-4" 
                        style={{ borderColor: '#FFA725' }}
                    ></div>
                    <p className="text-gray-600 mb-2">{loadingMessage}</p>
                    <div className="w-full max-w-xs bg-gray-200 rounded-full h-2.5 mb-2">
                        <div 
                            className="h-2.5 rounded-full transition-all duration-300" 
                            style={{ width: `${loadingProgress}%`, backgroundColor: '#FFA725' }}
                        ></div>
                    </div>
                    <p className="text-xs text-gray-500">{loadingProgress}% complete</p>
                </div>
            ) : error ? (
                <div className="flex flex-col items-center justify-center w-full h-64">
                    <div className="text-red-500 mb-4">{error}</div>
                    <label 
                        htmlFor="dropzone-file" 
                        className="px-4 py-2 text-white rounded-lg cursor-pointer hover:opacity-90"
                        style={{ backgroundColor: '#FFA725' }}
                    >
                        Try Again
                    </label>
                    <Input 
                        id="dropzone-file" 
                        type="file" 
                        className="hidden" 
                        onChange={handleFileChange}
                        accept="image/*"
                    />
                </div>
            ) : (
                <label 
                    htmlFor="dropzone-file" 
                    className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg 
                            className="w-12 h-12 mb-4 text-gray-500" 
                            aria-hidden="true" 
                            xmlns="http://www.w3.org/2000/svg" 
                            fill="none" 
                            viewBox="0 0 20 16"
                        >
                            <path 
                                stroke="currentColor" 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth="2" 
                                d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                            />
                        </svg>
                        <p className="mb-2 text-sm text-gray-500">
                            <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">PNG, JPG or JPEG</p>
                    </div>
                    <Input 
                        id="dropzone-file" 
                        type="file" 
                        className="hidden" 
                        onChange={handleFileChange}
                        accept="image/*"
                    />
                </label>
            )}
        </div>
    );
}
