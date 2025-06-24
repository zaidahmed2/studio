'use server';
/**
 * @fileOverview Analyzes training data and suggests improvements.
 *
 * - suggestTrainingDataImprovements - A function that handles the analysis and suggestion process.
 * - SuggestTrainingDataImprovementsInput - The input type for the suggestTrainingDataImprovements function.
 * - SuggestTrainingDataImprovementsOutput - The return type for the suggestTrainingDataImprovements function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestTrainingDataImprovementsInputSchema = z.object({
  trainingData: z
    .string()
    .describe('The training data to analyze.'),
});
export type SuggestTrainingDataImprovementsInput = z.infer<typeof SuggestTrainingDataImprovementsInputSchema>;

const SuggestTrainingDataImprovementsOutputSchema = z.object({
  suggestions: z.array(z.string()).describe('The suggestions for improving the training data.'),
});
export type SuggestTrainingDataImprovementsOutput = z.infer<typeof SuggestTrainingDataImprovementsOutputSchema>;

export async function suggestTrainingDataImprovements(input: SuggestTrainingDataImprovementsInput): Promise<SuggestTrainingDataImprovementsOutput> {
  return suggestTrainingDataImprovementsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestTrainingDataImprovementsPrompt',
  input: {schema: SuggestTrainingDataImprovementsInputSchema},
  output: {schema: SuggestTrainingDataImprovementsOutputSchema},
  prompt: `You are an expert AI training data analyst. Your job is to review the provided training data and suggest concrete improvements to increase the performance of the AI model trained using it.

Training Data:
{{{trainingData}}}

Suggestions:`,
});

const suggestTrainingDataImprovementsFlow = ai.defineFlow(
  {
    name: 'suggestTrainingDataImprovementsFlow',
    inputSchema: SuggestTrainingDataImprovementsInputSchema,
    outputSchema: SuggestTrainingDataImprovementsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
