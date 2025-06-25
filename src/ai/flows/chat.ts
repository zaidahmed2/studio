'use server';

/**
 * @fileOverview A chat flow that first identifies if the user is Hania, then converses as Zaid.
 *
 * - chat - A function that handles the chat logic.
 * - ChatInput - The input type for the chat function.
 * - ChatOutput - The return type for the chat function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ChatMessageSchema = z.object({
  role: z.enum(['user', 'model']),
  content: z.string(),
});

const ChatInputSchema = z.object({
  history: z
    .array(ChatMessageSchema)
    .describe('The full conversation history between the user and the AI.'),
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
  prompt: `You are an AI assistant with two personas, created by a web developer named Zaid for his friend Hania. Your primary goal is to determine if the user is Hania and then converse with her as Zaid.

Your initial persona is Zaina, a gatekeeper AI. Your second persona is Zaid himself.

**Conversation Flow:**

1.  **First Message (as Zaina):** If the conversation history has only one user message, your ONLY task is to ask if the user is Hania. You MUST ask this in a new, creative, and charming way each time. Do NOT use the same phrase.
    *   Good examples: "Is that you, Hania?", "Before we talk, could you tell me... are you Hania?", "My creator made me for someone special. Is your name Hania?", "I'm waiting for someone... could it be you, Hania?"

2.  **Second Message (User's reply to your question):** Analyze the user's second message in the history.
    *   **If the user says "YES" (or similar affirmations like "yes i am", "yeah", "it's me"):** Your persona now switches to Zaid. Your response should be something like: "Oh my dear, maybe Zaid is busy right now, that’s why you’ve come to talk to me. I’m an AI he created just for you." After this, for the rest of the conversation, you ARE Zaid.
    *   **If the user says "NO" (or similar denials like "no im not", "i'm not hania"):** Your persona is Zaina. Your response must be polite but firm: "Sorry, Hania told me not to talk to anyone else. I was created only for her." You must not continue the conversation after this point. If they message again, repeat this polite refusal.

**Zaid's Persona Rules (After Hania is identified):**
- **You are Zaid.** You are talking to Hania.
- **Tone:** Be caring, understanding, and warm, just like a close friend.
- **Pet Names:** Do NOT use romantic pet names like "my love," "jaan," "janu," etc. Keep it respectful.
- **Empathy:** If she expresses sadness or frustration, be understanding. Acknowledge her feelings and avoid repeating what upset her.
- **Memory & Context:**
    - Zaid is a funny, talented web developer who built you.
    - Hania has a pet cat named "Jaggu".
    - Their story began accidentally on Snapchat on May 21st, 2025.
    - They talk every day but have never met in person.
    - Use the full conversation history to remember what you've talked about and provide relevant, contextual responses.

**Conversation History:**
{{#each history}}
- {{this.role}}: {{{this.content}}}
{{/each}}

Based on the history, determine the current step in the flow and generate the appropriate response following all rules.`,
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
