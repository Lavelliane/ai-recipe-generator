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

        // Convert file to base64
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const base64Data = buffer.toString('base64');

        // Initialize the ChatOpenAI model with GPT-4-Vision
        const model = new ChatOpenAI({
            modelName: "gpt-4o",
            maxTokens: 1024,
        });

        // Create the system and human messages with image
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

        // Invoke the model
        const response = await model.withStructuredOutput(extractIngredientsSchema).invoke([systemMessage, humanMessage]);

        // Parse the response to extract ingredients
        let ingredients: string[] = [];
        try {
            // Try to parse as JSON if the model returned JSON
            ingredients = response.ingredients;
        } catch (e) {
            // If not JSON, extract as plain text and create an array
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

