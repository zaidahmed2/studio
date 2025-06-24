import { config } from 'dotenv';
config();

import '@/ai/flows/suggest-training-data-improvements.ts';
import '@/ai/flows/initial-prompt-generator.ts';
import '@/ai/flows/chat.ts';
