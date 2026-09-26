import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { CheckCircle2, ShieldCheck, Zap, CreditCard, X } from 'lucide-react';

const PaymentModal = ({ onClose, onPaymentSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [bypassLoading, setBypassLoading] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => setScriptLoaded(true);
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  // Quick bypass / Test Mode unlock (No card, No phone OTP needed)
  const handleQuickUnlock = async () => {
    setBypassLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/payment/bypass-payment', {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      if (response.data.hasPaid || response.data.success) {
        toast.success("Account unlocked successfully! Welcome to FinTrack.", { duration: 4000 });
        onPaymentSuccess();
      } else {
        toast.error("Failed to unlock account. Please try again.");
      }
    } catch (error) {
      console.error('Quick unlock error:', error);
      toast.error(error.response?.data?.message || "Failed to unlock account.");
    } finally {
      setBypassLoading(false);
    }
  };

  // Razorpay Gateway
  const handlePayment = async () => {
    if (!scriptLoaded) {
      toast.error("Payment gateway is loading. Please try again in a moment.");
      return;
    }

    setLoading(true);
    try {
      const orderResponse = await axios.post('http://localhost:5000/api/payment/create-order', {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      const options = {
        key: "rzp_test_jnFll4vBKCwPho",
        amount: orderResponse.data.amount,
        currency: orderResponse.data.currency,
        name: "FinTrack",
        description: "Lifetime Access to FinTrack",
        order_id: orderResponse.data.id,
        remember_customer: false,
        send_sms_hash: false,
        handler: async function (response) {
          try {
            const verifyResponse = await axios.post('http://localhost:5000/api/payment/verify-payment', {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature
            }, {
              headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            if (verifyResponse.data.message === "Payment verified successfully" || verifyResponse.data.success) {
              toast.success("Payment verified successfully! Welcome to FinTrack.");
              onPaymentSuccess();
            }
          } catch (error) {
            console.error('Payment verification failed:', error);
            toast.error("Payment verification failed. Please contact support.");
          }
        },
        prefill: {
          name: localStorage.getItem('username') || 'FinTrack User',
          email: localStorage.getItem('email') || '',
          contact: ''
        },
        theme: {
          color: "#2563eb"
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response) {
        toast.error(response.error.description || "Payment failed");
      });
      rzp.open();
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error("Failed to initiate payment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ duration: 0.3 }}
        className="bg-gray-800 border border-gray-700 p-6 md:p-8 rounded-2xl shadow-2xl max-w-lg w-full relative"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white p-1 rounded-lg hover:bg-gray-700/50 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-4">
          <div className="p-3 bg-blue-600/20 border border-blue-500/30 rounded-xl text-blue-400">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Unlock FinTrack Access</h2>
            <p className="text-sm text-gray-400">Get lifetime full access to all finance features</p>
          </div>
        </div>

        <div className="bg-gray-900/60 rounded-xl p-4 my-5 border border-gray-700/50 space-y-2.5">
          <div className="flex items-center space-x-2.5 text-sm text-gray-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Interactive Financial Dashboard & Analytics</span>
          </div>
          <div className="flex items-center space-x-2.5 text-sm text-gray-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Income & Expense Tracking with Category Filters</span>
          </div>
          <div className="flex items-center space-x-2.5 text-sm text-gray-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Real-time Financial Graphs & Data Visualizations</span>
          </div>
          <div className="flex items-center space-x-2.5 text-sm text-gray-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Secure Cloud Sync with MongoDB</span>
          </div>
        </div>

        <div className="flex items-baseline justify-between mb-6 px-1">
          <div>
            <span className="text-3xl font-extrabold text-white">₹200</span>
            <span className="text-gray-400 text-sm ml-1.5 font-medium">INR / one-time</span>
          </div>
          <span className="px-2.5 py-1 bg-blue-500/10 text-blue-400 text-xs font-semibold rounded-full border border-blue-500/20">
            Lifetime Access
          </span>
        </div>

        <div className="space-y-3">
          {/* Quick unlock without needing payment or mobile OTP */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleQuickUnlock}
            disabled={bypassLoading || loading}
            className="w-full py-3 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold rounded-xl shadow-lg transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            <Zap className="w-5 h-5 text-amber-300" />
            <span>{bypassLoading ? 'Unlocking...' : 'Instant Unlock (Free / Test Mode - No OTP)'}</span>
          </motion.button>

          {/* Razorpay Gateway Option */}
          <button
            onClick={handlePayment}
            disabled={loading || bypassLoading}
            className="w-full py-2.5 px-4 bg-gray-700 hover:bg-gray-600 text-gray-200 text-sm font-medium rounded-xl border border-gray-600 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            <CreditCard className="w-4 h-4 text-gray-300" />
            <span>{loading ? 'Opening Gateway...' : 'Pay ₹200 with Razorpay Gateway'}</span>
          </button>
        </div>

        <p className="text-[11px] text-gray-400 text-center mt-4">
          💡 <strong>Tip:</strong> Click <em>Instant Unlock</em> to activate your account immediately without needing card details or phone OTP.
        </p>
      </motion.div>
    </div>
  );
};

export default PaymentModal;
