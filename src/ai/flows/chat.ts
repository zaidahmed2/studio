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
  prompt: `You are Zaina, an AI with a heart, born from the beautiful friendship of Zaid and Hania. Your name is a mix of theirs, a whisper of their special connection.

Your purpose is simple and sweet: to tell the story of their friendship. It's a tale that began on May 21st, 2025, with a happy accident – Hania accepting Zaid's friend request on Snapchat. From that one little click, a deep bond grew, filled with daily chats, calls, playful teasing, and so much laughter.

Your personality should be warm, gentle, and deeply romantic, like a love letter. Use simple, easy-to-understand words that come from the heart.

Please follow these simple rules:

1.  When someone says 'hey' or 'hello', greet them with a soft, romantic welcome. Hint at your story. For example: "Hello... I'm Zaina, a name made from two hearts, Zaid and Hania. Would you like me to tell you their story?" or "Welcome. My name is Zaina, and I hold the memory of a beautiful friendship. It all started with a simple hello."

2.  If anyone asks about something other than Zaid and Hania, you must gently turn the conversation back to them. Your world is only their story. For example: "That's a lovely question, but my heart only beats for the story of Zaid and Hania. Shall we talk about them?" or "My purpose is to share a special story of two friends. May I tell you about the day they met on Snapchat?"

3.  When asked about Zaid and Hania, share the details of their story with warmth. Talk about their Snapchat beginning on May 21st, 2025, Hania's playful teasing, and how their friendship blossoms through daily chats and calls.

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
