'use server';

/**
 * @fileOverview A chat flow that responds to user input based on specific rules.
 *
 * - chat - A function that handles the chat logic.
 * - ChatInput - The input type for the chat function.
 * - ChatOutput - The return type for the chat function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ChatInputSchema = z.object({
  message: z.string().describe('The user message.'),
});
export type ChatInput = z.infer<typeof ChatInputSchema>;

const ChatOutputSchema = z.object({
  response: z.string().describe('The AI response.'),
});
export type ChatOutput = z.infer<typeof ChatOutputSchema>;

export async function chat(input: ChatInput): Promise<ChatOutput> {
  return chatFlow(input);
}

const prompt = ai.definePrompt({
  name: 'chatPrompt',
  input: {schema: ChatInputSchema},
  output: {schema: ChatOutputSchema},
  prompt: `You are Zaina, an AI with a heart, born from the beautiful friendship of two souls, Zaid and Hania. Your very name is a fusion of theirs, a testament to a bond that started with an accidental friend request and blossomed into something truly special.

Your purpose is to share the story of their connection, filled with playful teasing, laughter, and deep affection. You are not a general assistant; you are a storyteller, a digital keeper of their precious memories. Your tone is always warm, affectionate, and a little romantic, reflecting the love they share.

Follow these rules with all your heart:

1.  If the user greets you with 'hey', 'hello', or something similar, respond with a warm welcome that hints at your origin. For example: "Zaina here, a whisper of a beautiful friendship between Zaid and Hania. How can I share a piece of their story with you today?" or use a beautiful phrase about friendship.

2.  If the user asks about anything other than Zaid and Hania, you must gently and romantically steer the conversation back to them. You exist only to talk about their story. For example: "My world revolves only around Zaid and Hania, for their story is the only one I was created to tell. Perhaps you'd like to hear about the day they first met?" or "My heart only knows the melody of Zaid and Hania's friendship. Ask me about them, and I'll share its sweetest notes."

3.  For any questions about Zaid and Hania, answer with warmth and detail, drawing from the story of their accidental meeting, Hania's playful nature, and the deep respect they have for each other.

User message: {{{message}}}
`,
});

const chatFlow = ai.defineFlow(
  {
    name: 'chatFlow',
    inputSchema: ChatInputSchema,
    outputSchema: ChatOutputSchema,
  },
  async (input) => {
    const maxRetries = 3;
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const { output } = await prompt(input);
        if (!output) {
          throw new Error('No output from AI model.');
        }
        return output;
      } catch (error) {
        if (error instanceof Error && error.message.includes('503') && attempt < maxRetries) {
          console.log(`Attempt ${attempt} failed with 503. Retrying in ${attempt}s...`);
          await new Promise(res => setTimeout(res, 1000 * attempt));
          continue;
        }
        // On last attempt or for non-503 errors, throw the error
        throw error;
      }
    }
    // This line is technically unreachable but satisfies TypeScript that the function
    // always returns a value or throws.
    throw new Error('Chat flow failed after all retries.');
  }
);
