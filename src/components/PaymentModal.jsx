// import React, { useState } from 'react';
// import axios from 'axios';
// import { motion } from 'framer-motion';
// import { toast } from 'react-hot-toast';

// const PaymentModal = ({ onClose, onPaymentSuccess }) => {
//   const [loading, setLoading] = useState(false);

//   const handlePayment = async () => {
//     setLoading(true);
//     try {
//       const orderResponse = await axios.post('http://localhost:5000/api/payment/create-order', {}, {
//         headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
//       });

//       const options = {
//         key: "rzp_test_jnFll4vBKCwPho",
//         amount: orderResponse.data.amount,
//         currency: orderResponse.data.currency,
//         name: "Finance Tracker",
//         description: "One-time payment for lifetime access",
//         order_id: orderResponse.data.id,
//         handler: async function (response) {
//           try {
//             const verifyResponse = await axios.post('http://localhost:5000/api/payment/verify-payment', {
//               razorpay_payment_id: response.razorpay_payment_id,
//               razorpay_order_id: response.razorpay_order_id,
//               razorpay_signature: response.razorpay_signature
//             }, {
//               headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
//             });
//             if (verifyResponse.data.message === "Payment verified successfully") {
//               toast.success("Payment successful!");
//               onPaymentSuccess();
//             }
//           } catch (error) {
//             console.error('Payment verification failed:', error);
//             toast.error("Payment verification failed. Please contact support.");
//           }
//         },
//         prefill: {
//           name: localStorage.getItem('username'),
//           email: localStorage.getItem('email'),
//         },
//         theme: {
//           color: "#3399cc"
//         }
//       };

//       const rzp = new window.Razorpay(options);
//       rzp.on('payment.failed', function (response){
//         toast.error(response.error.description);
//       });
//       rzp.open();
//     } catch (error) {
//       console.error('Error creating order:', error);
//       toast.error("Failed to initiate payment. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//       <motion.div
//         initial={{ opacity: 0, scale: 0.8 }}
//         animate={{ opacity: 1, scale: 1 }}
//         exit={{ opacity: 0, scale: 0.8 }}
//         className="bg-gray-800 p-8 rounded-lg shadow-xl max-w-md w-full"
//       >
//         <h2 className="text-2xl font-bold mb-4 text-white">One-time Payment Required</h2>
//         <p className="text-gray-300 mb-6">
//           To access all features of the Finance Tracker, a one-time payment of 200 rupees is required.
//         </p>
//         <div className="flex justify-between">
//           <button
//             onClick={onClose}
//             className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={handlePayment}
//             disabled={loading}
//             className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
//           >
//             {loading ? 'Processing...' : 'Pay 200 INR'}
//           </button>
//         </div>
//       </motion.div>
//     </div>
//   );
// };

// export default PaymentModal;







import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';

const PaymentModal = ({ onClose, onPaymentSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => setScriptLoaded(true);
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handlePayment = async () => {
    if (!scriptLoaded) {
      toast.error("Razorpay script is not loaded yet. Please try again in a moment.");
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
        name: "Finance Tracker",
        description: "One-time payment for lifetime access",
        order_id: orderResponse.data.id,
        handler: async function (response) {
          try {
            const verifyResponse = await axios.post('http://localhost:5000/api/payment/verify-payment', {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature
            }, {
              headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            if (verifyResponse.data.message === "Payment verified successfully") {
              toast.success("Payment successful!");
              onPaymentSuccess();
            }
          } catch (error) {
            console.error('Payment verification failed:', error);
            toast.error("Payment verification failed. Please contact support.");
          }
        },
        prefill: {
          name: localStorage.getItem('username'),
          email: localStorage.getItem('email'),
        },
        theme: {
          color: "#3399cc"
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response){
        toast.error(response.error.description);
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        className="bg-gray-800 p-8 rounded-lg shadow-xl max-w-md w-full"
      >
        <h2 className="text-2xl font-bold mb-4 text-white">One-time Payment Required</h2>
        <p className="text-gray-300 mb-6">
          To access all features of the Finance Tracker, a one-time payment of 200 rupees is required.
        </p>
        <div className="flex justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handlePayment}
            disabled={loading || !scriptLoaded}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Pay 200 INR'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default PaymentModal;

