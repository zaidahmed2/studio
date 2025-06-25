"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { suggestTrainingDataImprovements } from "@/ai/flows/suggest-training-data-improvements";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Lightbulb, Loader2 } from "lucide-react";

const sampleData = `[
  {"input": "What are your hours?", "output": "We are open from 9 AM to 5 PM, Monday to Friday."},
  {"input": "Do you offer customer support?", "output": "Yes, we offer 24/7 customer support via email and chat."},
  {"input": "How can I reset my password?", "output": "You can reset your password by visiting the account settings page and clicking on 'Forgot Password'."},
  {"input": "What is the return policy", "output": "Our return policy allows returns within 30 days of purchase, provided the item is in its original condition."}
]`;

export default function TrainingPage() {
  const [trainingData, setTrainingData] = useState(sampleData);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleAnalyze = async () => {
    setIsLoading(true);
    setSuggestions([]);
    try {
      const result = await suggestTrainingDataImprovements({ trainingData });
      if (result.suggestions && result.suggestions.length > 0) {
        setSuggestions(result.suggestions);
      } else {
        toast({
            title: "No Suggestions",
            description: "The AI analyzer didn't find any specific improvements. Your data looks good!",
        });
      }
    } catch (error) {
      console.error("Failed to analyze training data:", error);
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: "An error occurred while analyzing the training data. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <h1 className="text-3xl font-bold tracking-tight">Training Data</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Import Training Data</CardTitle>
            <CardDescription>
              Paste your training data here in JSON format. Then, use our AI tool to get suggestions for improvement.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={trainingData}
              onChange={(e) => setTrainingData(e.target.value)}
              placeholder="Paste your training data here..."
              className="min-h-[300px] font-mono text-sm"
            />
            <div className="flex gap-2">
                <Button onClick={handleAnalyze} disabled={isLoading}>
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Analyzing...
                        </>
                    ) : (
                        "Refine with AI"
                    )}
                </Button>
                <Button variant="secondary">Save Data</Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Refinement Suggestions</CardTitle>
            <CardDescription>
              AI-powered suggestions to improve your training data will appear here.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {suggestions.length > 0 ? (
              <Alert>
                <Lightbulb className="h-4 w-4" />
                <AlertTitle>Opportunities for Refinement</AlertTitle>
                <AlertDescription>
                  <ul className="mt-2 list-disc list-inside space-y-2">
                    {suggestions.map((suggestion, index) => (
                      <li key={index}>{suggestion}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            ) : (
                <div className="text-center text-muted-foreground py-10">
                    <p>Click "Refine with AI" to get started.</p>
                </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
