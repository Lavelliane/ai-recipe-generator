'use server';

import { z } from 'zod';
import { ChatOpenAI, OpenAI } from '@langchain/openai';
import { PromptTemplate } from '@langchain/core/prompts';

// Define simplified schema for the output
const recipeHelpResponseSchema = z.object({
  instruction: z.string().describe('Brief, clear guidance for the current recipe step')
});

// Define input validation schema
const recipeHelpRequestSchema = z.object({
  recipeName: z.string(),
  currentStep: z.number(),
  stepInstruction: z.string(),
  userQuery: z.string(),
  dietaryRestrictions: z.array(z.string()).optional(),
});

type RecipeHelpRequest = z.infer<typeof recipeHelpRequestSchema>;
export type RecipeHelpResponse = z.infer<typeof recipeHelpResponseSchema>;

/**
 * Server action to get concise AI guidance for a recipe step
 */
export async function getRecipeHelp(request: RecipeHelpRequest): Promise<{ success: boolean; instruction?: string; error?: string }> {
  try {
    // Validate request data
    const validatedData = recipeHelpRequestSchema.parse(request);
    
    // Create OpenAI instance
    const model = new ChatOpenAI({
      modelName: "gpt-4o-mini", // Using a faster model for simple responses
      temperature: 0.3,
    });

    // Create a prompt template
    const prompt = new PromptTemplate({
      template: `You are a helpful cooking assistant providing BRIEF guidance.

Recipe: {recipeName}
Current Step ({currentStep}): {stepInstruction}
User Question: "{userQuery}"
{dietaryInfo}

Provide a single, clear paragraph of advice to help with this specific step. 
Be direct and practical - your entire response should be 2-3 sentences maximum.`,
      inputVariables: ["recipeName", "currentStep", "stepInstruction", "userQuery", "dietaryInfo"],
    });

    // Prepare dietary info if available
    const dietaryInfo = validatedData.dietaryRestrictions?.length 
      ? `Dietary restrictions: ${validatedData.dietaryRestrictions.join(", ")}`
      : "";

    // Format the prompt with our data
    const formattedPrompt = await prompt.format({
      recipeName: validatedData.recipeName,
      currentStep: validatedData.currentStep,
      stepInstruction: validatedData.stepInstruction,
      userQuery: validatedData.userQuery,
      dietaryInfo,
    });

    // Call the model
    const result = await model.invoke(formattedPrompt);
    
    return {
      success: true,
      instruction: result.content.toString(),
    };
  } catch (error) {
    console.error("Recipe help error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
}
