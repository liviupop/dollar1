
# Stripe Integration Setup for Supabase

To enable real Stripe payments for the Cover Letter Generator application with Supabase, follow these steps:

## 1. Set up a Stripe Account

If you haven't already, create a Stripe account at [stripe.com](https://stripe.com) and obtain your API keys.

## 2. Deploy the Edge Function to Supabase

1. Install the Supabase CLI if you haven't already:
   ```
   npm install -g supabase
   ```

2. Link your project:
   ```
   supabase link --project-ref your-project-reference
   ```

3. Set your Stripe secret key as a secret in your Supabase project:
   ```
   supabase secrets set STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key
   ```

4. Deploy the function:
   ```
   supabase functions deploy create-payment-intent
   ```

## 3. Update CORS Policy (if needed)

If you're experiencing CORS issues, update your function's CORS configuration in the Supabase dashboard:

1. Go to your Supabase project
2. Navigate to Functions
3. Select the create-payment-intent function
4. Configure the allowed origins to include your application's domain

## 4. How It Works

The application is configured to:

1. Frontend: Use your Stripe public key (configured in src/lib/stripe.ts)
2. Backend: Use a Supabase Edge Function at `https://your-project-reference.supabase.co/functions/v1/create-payment-intent` to create payment intents
3. The edge function communicates with Stripe using your secret key and returns the client secret to the frontend

## 5. Testing

When testing, you can use Stripe's test cards:
- 4242 4242 4242 4242 (Success)
- 4000 0000 0000 0002 (Declined)

See [Stripe's documentation](https://stripe.com/docs/testing) for more test cards.

## Important Notes

- In test mode, use your `sk_test_...` key instead of the live key
- The Stripe public key in the frontend should match the environment of your secret key (test/live)
- Make sure to update the URL in src/lib/stripe.ts with your actual Supabase project reference
