
import React, { useState, useEffect } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe, createPaymentIntent } from '@/lib/stripe';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/sonner";
import PaymentForm from './PaymentForm';

// Initialize the Stripe loader
const stripePromise = loadStripe();

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
        try {
          const secret = await createPaymentIntent();
          setClientSecret(secret);
        } catch (error) {
          console.error("Error getting payment intent:", error);
          toast.error("Could not initialize payment system");
        } finally {
          setIsLoading(false);
        }
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
