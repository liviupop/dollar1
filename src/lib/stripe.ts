
import { toast } from "@/components/ui/sonner";

// Stripe live public key
const STRIPE_PUBLIC_KEY = "pk_live_51QXN3uEQkWZeEYv9hOt5gcjTEIw6Gl8h7q8TlfpNVTp8NTDQfJonbu22MSGk2R4N2w9yFkmb7Yuq8UG3e2jVCyEK00lcGwEOP8";

// Used to track if the user has created a free cover letter already
const LOCAL_STORAGE_KEY = "has_generated_cover_letter";

interface PaymentIntentResponse {
  clientSecret: string;
}

export async function createPaymentIntent(): Promise<string | null> {
  try {
    // Call our Netlify serverless function to create a payment intent
    const response = await fetch('/.netlify/functions/create-payment-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: 100, // $1.00
        currency: 'usd',
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Payment API error:", errorData);
      throw new Error("Failed to create payment intent");
    }

    const data = await response.json();
    return data.clientSecret;

  } catch (error) {
    console.error("Error creating payment intent:", error);
    toast.error("Failed to create payment session");
    return null;
  }
}

export async function loadStripe() {
  const stripe = await import('@stripe/stripe-js');
  return await stripe.loadStripe(STRIPE_PUBLIC_KEY);
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
