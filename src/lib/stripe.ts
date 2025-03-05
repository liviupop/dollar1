
import { toast } from "@/components/ui/sonner";

// Stripe live public key
const STRIPE_PUBLIC_KEY = "pk_live_51QXN3uEQkWZeEYv9hOt5gcjTEIw6Gl8h7q8TlfpNVTp8NTDQfJonbu22MSGk2R4N2w9yFkmb7Yuq8UG3e2jVCyEK00lcGwEOP8";

// Used to track if the user has created a free cover letter already
const LOCAL_STORAGE_KEY = "has_generated_cover_letter";

// Your Supabase project URL
const SUPABASE_URL = "https://jquaayoqnomtxbfmacpy.supabase.co";

export async function createPaymentIntent(): Promise<string | null> {
  try {
    console.log("Attempting to create payment intent via Supabase Edge Function");
    
    // Call our Supabase Edge Function to create a payment intent
    const response = await fetch(`${SUPABASE_URL}/functions/v1/create-payment-intent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Adding anon key for authorization
        'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpxdWFheW9xbm9tdHhiZm1hY3B5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDExNzI3NjgsImV4cCI6MjA1Njc0ODc2OH0.LuoZdyA0qniXZlt_jb8dsMrZoXkVkzwax6eEMnEA4TU`
      },
      body: JSON.stringify({
        amount: 100, // $1.00
        currency: 'usd',
      })
    });

    console.log("Response status:", response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Payment API error response:", errorText);
      
      try {
        const errorData = JSON.parse(errorText);
        console.error("Payment API error (parsed):", errorData);
        throw new Error(`Failed to create payment intent: ${errorData.error || 'Unknown error'}`);
      } catch (parseError) {
        console.error("Error parsing error response:", parseError);
        throw new Error(`Failed to create payment intent: ${errorText || 'Unknown error'}`);
      }
    }

    const data = await response.json();
    console.log("Payment intent created successfully");
    return data.clientSecret;

  } catch (error) {
    console.error("Error creating payment intent:", error);
    toast.error("Failed to create payment session. Please try again later.");
    return null;
  }
}

export async function loadStripe() {
  try {
    const stripe = await import('@stripe/stripe-js');
    return await stripe.loadStripe(STRIPE_PUBLIC_KEY);
  } catch (error) {
    console.error("Error loading Stripe:", error);
    return null;
  }
}

export function hasFreeGeneration(): boolean {
  return localStorage.getItem(LOCAL_STORAGE_KEY) !== "true";
}

export function markFreeGenerationUsed(): void {
  localStorage.setItem(LOCAL_STORAGE_KEY, "true");
}

export function resetFreeGeneration(): void {
  localStorage.removeItem(LOCAL_STORAGE_KEY);
}
