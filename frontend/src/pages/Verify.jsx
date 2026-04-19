import axios from 'axios';
import React, { useContext, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';

const Verify = () => {

    const [searchParams, setSearchParams] = useSearchParams()

    const success = searchParams.get("success")
    const appointmentId = searchParams.get("appointmentId")

    const { backendUrl, token } = useContext(AppContext)

    const navigate = useNavigate()

    // Function to verify stripe payment
    const verifyStripe = async () => {
        try {
            console.log("Verifying payment with backend URL:", backendUrl);
            
            // Use template literals for cleaner URL construction
            const response = await axios.post(
                `${backendUrl}/api/user/verifyStripe`, 
                { success, appointmentId }, 
                { 
                    headers: { 
                        token,
                        'Content-Type': 'application/json'
                    },
                    // Set withCredentials to false to avoid CORS preflight issues
                    withCredentials: false
                }
            );

            const data = response.data;
            
            if (data.success) {
                toast.success(data.message);
            } else {
                toast.error(data.message || "Verification failed");
            }

            navigate("/my-appointments");
        } catch (error) {
            console.error("Stripe verification error:", error);
            
            // More detailed error handling
            if (error.response) {
                console.error("Error response:", error.response.status, error.response.data);
                toast.error(`Error ${error.response.status}: ${error.response.data?.message || "Server error"}`);
            } else if (error.request) {
                console.error("No response received:", error.request);
                toast.error("No response from server. Check if backend is running or CORS is configured correctly.");
            } else {
                toast.error(`Error: ${error.message}`);
            }
            
            // Navigate anyway after a short delay
            setTimeout(() => navigate("/my-appointments"), 3000);
        }
    }

    useEffect(() => {
        if (token && appointmentId && success) {
            verifyStripe()
        }
    }, [token, appointmentId, success])

    return (
        <div className='pt-20 min-h-[60vh] flex items-center justify-center'>
            <div className="w-20 h-20 border-4 border-gray-300 border-t-4 border-t-primary rounded-full animate-spin"></div>
        </div>
    )
}

export default Verify
