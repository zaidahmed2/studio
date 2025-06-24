'use server';

/**
 * @fileOverview Generates detailed initial prompts for training the model based on a high-level prompt.
 *
 * - generateInitialPrompts - A function that generates initial prompts for training.
 * - GenerateInitialPromptsInput - The input type for the generateInitialPrompts function.
 * - GenerateInitialPromptsOutput - The return type for the generateInitialPrompts function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateInitialPromptsInputSchema = z.object({
  highLevelPrompt: z.string().describe('A high-level prompt describing the desired application.'),
});
export type GenerateInitialPromptsInput = z.infer<typeof GenerateInitialPromptsInputSchema>;

const GenerateInitialPromptsOutputSchema = z.object({
  initialPrompts: z
    .array(z.string())
    .describe('An array of detailed and specific initial prompts for training the model.'),
});
export type GenerateInitialPromptsOutput = z.infer<typeof GenerateInitialPromptsOutputSchema>;

export async function generateInitialPrompts(
  input: GenerateInitialPromptsInput
): Promise<GenerateInitialPromptsOutput> {
  return generateInitialPromptsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateInitialPromptsPrompt',
  input: {schema: GenerateInitialPromptsInputSchema},
  output: {schema: GenerateInitialPromptsOutputSchema},
  prompt: `You are an AI prompt engineer. Your job is to convert a high-level prompt for an application into a list of detailed and specific initial prompts that can be used to start training the model effectively.  Each prompt should be designed to elicit specific and useful responses from the model.

High-Level Prompt: {{{highLevelPrompt}}}

Detailed Initial Prompts:`, // No Handlebars 'each' syntax is needed, since the output should be the entire array
});

const generateInitialPromptsFlow = ai.defineFlow(
  {
    name: 'generateInitialPromptsFlow',
    inputSchema: GenerateInitialPromptsInputSchema,
    outputSchema: GenerateInitialPromptsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
