
# Stripe Integration Setup for Netlify

To enable real Stripe payments for the Cover Letter Generator application on Netlify, follow these steps:

## 1. Set up a Stripe Account

If you haven't already, create a Stripe account at [stripe.com](https://stripe.com) and obtain your API keys.

## 2. Deploy to Netlify

1. Push your code to a GitHub repository
2. Go to [netlify.com](https://netlify.com) and create a new site
3. Import your GitHub repository
4. Configure the build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`

## 3. Environment Variables

In your Netlify site dashboard:

1. Go to Site settings > Environment variables
2. Add the following environment variable:
   - Key: `STRIPE_SECRET_KEY`
   - Value: `sk_live_your_stripe_secret_key` (replace with your actual Stripe secret key)
3. Ensure the environment variable is available in Production

## 4. How It Works

The application is configured to:

1. Frontend: Use your Stripe public key (already configured in src/lib/stripe.ts)
2. Backend: Use a Netlify serverless function at `/.netlify/functions/create-payment-intent` to create payment intents
3. The serverless function communicates with Stripe using your secret key and returns the client secret to the frontend

## 5. Testing

When testing, you can use Stripe's test cards:
- 4242 4242 4242 4242 (Success)
- 4000 0000 0000 0002 (Declined)

See [Stripe's documentation](https://stripe.com/docs/testing) for more test cards.

## Important Notes

- In test mode, use your `sk_test_...` key instead of the live key
- For development, you can use environment variables in a `.env` file but DO NOT commit this file to your repository
- The Netlify deployment will automatically connect the API endpoint to your frontend
