
import React, { useState, useEffect } from 'react';
import { CardElement, Elements, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe, createPaymentIntent } from '@/lib/stripe';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { toast } from "@/components/ui/sonner";

const stripePromise = loadStripe();

interface PaymentFormProps {
  clientSecret: string | null;
  onSuccess: () => void;
  onCancel: () => void;
  isLoading: boolean;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ clientSecret, onSuccess, onCancel, isLoading }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements || !clientSecret) {
      return;
    }

    const cardElement = elements.getElement(CardElement);
    
    if (!cardElement) {
      toast.error("Card element not found");
      return;
    }

    setIsProcessing(true);

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
        toast.error(error.message || "Payment failed. Please try again.");
        console.error("Payment error:", error);
      } else if (paymentIntent.status === 'succeeded') {
        toast.success("Payment successful!");
        onSuccess();
      } else {
        toast.error(`Payment status: ${paymentIntent.status}. Please try again.`);
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Payment failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (!clientSecret && !isLoading) {
    return (
      <div className="text-center p-4">
        <p className="text-red-500 mb-4">Unable to initialize payment. Please try again later.</p>
        <Button onClick={onCancel}>Close</Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
      <DialogFooter className="flex flex-col sm:flex-row gap-2">
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
      </DialogFooter>
    </form>
  );
};

interface PaymentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ 
  open, 
  onOpenChange,
  onSuccess 
}) => {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const getPaymentIntent = async () => {
      if (open) {
        setIsLoading(true);
        const secret = await createPaymentIntent();
        setClientSecret(secret);
        setIsLoading(false);
      }
    };

    getPaymentIntent();
  }, [open]);

  const handleSuccess = () => {
    onSuccess();
    onOpenChange(false);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Payment Required</DialogTitle>
          <DialogDescription>
            You've used your free cover letter generation. Pay $1.00 to generate another one.
          </DialogDescription>
        </DialogHeader>
        
        <Elements stripe={stripePromise}>
          <PaymentForm 
            clientSecret={clientSecret} 
            onSuccess={handleSuccess} 
            onCancel={handleCancel}
            isLoading={isLoading}
          />
        </Elements>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;
