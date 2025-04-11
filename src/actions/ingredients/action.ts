'use server';

import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { type MessageContentText, type MessageContentImageUrl } from "@langchain/core/messages";
import { z } from "zod";

const extractIngredientsSchema = z.object({
    ingredients: z.array(z.string()).describe("The ingredients in the image"),
});

export async function extractIngredientsFromImage(formData: FormData) {
    try {
        const file = formData.get('image') as File;

        if (!file) {
            return {
                success: false,
                error: "No image file provided",
                ingredients: []
            };
        }

       
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const base64Data = buffer.toString('base64');

        
        const model = new ChatOpenAI({
            modelName: "gpt-4o",
            maxTokens: 1024,
        });

       
        const systemMessage = new SystemMessage(
            "You are a helpful assistant specialized in identifying ingredients from recipe images. " +
            "Extract and list all ingredients visible in the image. Format the response as a JSON array of strings."
        );

        const textContent: MessageContentText = {
            type: "text",
            text: "What ingredients can you identify in this recipe image? Please list them as clear items."
        };

        const imageContent: MessageContentImageUrl = {
            type: "image_url",
            image_url: {
                url: `data:image/jpeg;base64,${base64Data}`
            }
        };

        const humanMessage = new HumanMessage({
            content: [textContent, imageContent],
        });

        
        const response = await model.withStructuredOutput(extractIngredientsSchema).invoke([systemMessage, humanMessage]);

        
        let ingredients: string[] = [];
        try {
           
            ingredients = response.ingredients;
        } catch (e) {
            
            console.error(e);
        }

        console.log(ingredients);

        return {
            success: true,
            ingredients
        };
    } catch (error) {
        console.error("Error processing image:", error);
        return {
            success: false,
            error: "Failed to process image",
            ingredients: []
        };
    }
}
