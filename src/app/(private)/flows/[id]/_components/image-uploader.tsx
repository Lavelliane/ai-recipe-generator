'use client';

import { Input } from "@heroui/react";
import { useState, type ChangeEvent, useEffect } from "react";
import { extractIngredientsFromImage } from "@/actions/ingredients/action";
import { useRecipe } from "@/store/use-recipe";

export default function ImageUploader() {
    const [file, setFile] = useState<File | null>(null);
    const { setIngredients } = useRecipe();

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    useEffect(() => {
        async function fetchIngredients() {
            if (file) {
                const formData = new FormData();
                formData.append("image", file);
                const result = await extractIngredientsFromImage(formData);
                setIngredients(result.ingredients);
            }
        }
        fetchIngredients();
    }, [file]);

    return (
        <div className="flex flex-col gap-2">
            <label className="text-black">Upload a file</label>
            <Input type="file" onChange={handleFileChange} />
        </div>
    );
}
