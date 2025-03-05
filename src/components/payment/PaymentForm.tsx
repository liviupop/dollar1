
import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { Loader2 } from "lucide-react";
import { toast } from "@/components/ui/sonner";

interface PaymentFormProps {
  clientSecret: string | null;
  onSuccess: () => void;
  onCancel: () => void;
  isLoading: boolean;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ 
  clientSecret, 
  onSuccess, 
  onCancel, 
  isLoading 
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements || !clientSecret) {
      setPaymentError("Payment system not ready. Please try again later.");
      return;
    }

    const cardElement = elements.getElement(CardElement);
    
    if (!cardElement) {
      setPaymentError("Card element not found");
      return;
    }

    setIsProcessing(true);
    setPaymentError(null);

    try {
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: 'Cover Letter Customer',
          },
        }
      });

      if (error) {
        setPaymentError(error.message || "Payment failed. Please try again.");
        console.error("Payment error:", error);
      } else if (paymentIntent.status === 'succeeded') {
        toast.success("Payment successful!");
        onSuccess();
      } else {
        setPaymentError(`Payment status: ${paymentIntent.status}. Please try again.`);
      }
    } catch (error) {
      console.error("Payment error:", error);
      setPaymentError("Payment failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  // If there's no client secret and we're not loading, show an error
  if (!clientSecret && !isLoading) {
    return (
      <div className="text-center p-4 space-y-4">
        <p className="text-red-500 mb-4">
          Unable to initialize payment. Please try again later or contact support.
        </p>
        
        <div className="flex flex-col gap-2">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {paymentError && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-500 text-sm">
          {paymentError}
        </div>
      )}
      
      <div className="p-3 border rounded-md bg-white">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                  color: '#aab7c4',
                },
              },
              invalid: {
                color: '#9e2146',
              },
            },
          }}
        />
      </div>
      
      <div className="text-xs text-gray-500 mt-2">
        <p>Test Card: 4242 4242 4242 4242 | Any future date | Any 3 digits</p>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-2 justify-end mt-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isProcessing || isLoading}>
          Cancel
        </Button>
        <Button type="submit" disabled={!stripe || isProcessing || isLoading || !clientSecret}>
          {isProcessing || isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {isLoading ? 'Initializing...' : 'Processing...'}
            </>
          ) : (
            `Pay $1.00`
          )}
        </Button>
      </div>
    </form>
  );
};

export default PaymentForm;
