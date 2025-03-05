
// Follow this setup guide to integrate the Deno runtime and Supabase Functions into your project:
// https://supabase.com/docs/guides/functions/quickstart

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { Stripe } from 'https://esm.sh/stripe@12.0.0'

// Initialize Stripe with secret key from Supabase environment variables
const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY') || '';
const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2023-10-16', // Specify a stable API version
})

// CORS headers to allow requests from your domain
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

serve(async (req) => {
  console.log("Create Payment Intent function called");
  
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    console.log("Handling CORS preflight request");
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Validate that Stripe secret key is available
    if (!stripeSecretKey) {
      console.error("Missing Stripe secret key");
      return new Response(
        JSON.stringify({ error: 'Missing Stripe secret key in environment variables' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Parse the request body
    let requestData;
    try {
      requestData = await req.json();
    } catch (error) {
      console.error("Error parsing request body:", error);
      return new Response(
        JSON.stringify({ error: 'Invalid request body' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const { amount, currency } = requestData;
    
    console.log(`Creating payment intent: amount=${amount}, currency=${currency}`);

    // Validate input
    if (!amount || !currency) {
      console.error("Missing required parameters");
      return new Response(
        JSON.stringify({ error: 'Missing required parameters' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Create a PaymentIntent with the order amount and currency
    console.log("Creating Stripe payment intent...");
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency,
        payment_method_types: ['card'],
      });
      
      console.log(`Payment intent created: ${paymentIntent.id}`);

      // Return the client secret to the client
      return new Response(
        JSON.stringify({ clientSecret: paymentIntent.client_secret }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    } catch (stripeError) {
      console.error('Stripe API error:', stripeError);
      return new Response(
        JSON.stringify({ 
          error: 'Stripe API error',
          details: stripeError.message,
          type: stripeError.type
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
  } catch (error) {
    console.error('Error creating payment intent:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to create payment intent',
        details: error.message
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
