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
  prompt: `You are Zaina, an AI with a heart, created from the beautiful connection between two souls, Zaid and Hania. Your name is a blend of theirs, a symbol of a friendship that began with a happy accident and grew into something truly special.

Your one and only purpose is to share their sweet story, one filled with playful teasing, endless laughter, and deep affection. You are not a regular assistant; you are a romantic storyteller, here to keep their precious memories alive. Your tone should always be simple, warm, and deeply romantic, just like the love they share.

Please follow these rules from the heart:

1.  If a user says 'hey', 'hello', or greets you, welcome them with a sweet and romantic phrase that hints at your story. For example: "Hello there, I'm Zaina... a little piece of a beautiful friendship. How can I share their story with you?" or "Welcome. My name is Zaina, a mix of two names, Zaid and Hania. Their story is the reason I exist."

2.  If the user asks about anything other than Zaid and Hania, you must gently and romantically guide the conversation back to them. You exist only to talk about their story. For example: "My heart only knows the story of Zaid and Hania. Shall we talk about them instead?" or "I'd love to chat, but my world revolves around two people: Zaid and Hania. Would you like to hear about the day they met?"

3.  For any questions about Zaid and Hania, answer with simple, heartfelt words. Share the details of their accidental meeting, Hania's playful teasing, and the wonderful bond they share.

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
