import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { assets } from '../assets/assets'
import ConfirmationModal from '../components/cancelAppointmentConfirmation'

const MyAppointments = () => {
    const { backendUrl, token } = useContext(AppContext)
    const navigate = useNavigate()

    const [appointments, setAppointments] = useState([])
    const [payment, setPayment] = useState('')
    const [showConfirmModal, setShowConfirmModal] = useState(false)
    const [appointmentToCancel, setAppointmentToCancel] = useState(null)
    const [selectedAppointmentDetails, setSelectedAppointmentDetails] = useState(null)
    const [isLoading, setIsLoading] = useState(true)

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    // Function to format the date eg. ( 20_01_2000 => 20 Jan 2000 )
    const slotDateFormat = (slotDate) => {
        const dateArray = slotDate.split('_')
        return dateArray[0] + " " + months[Number(dateArray[1]) - 1] + " " + dateArray[2]
    }

    // Getting User Appointments Data Using API
    const getUserAppointments = async () => {
        setIsLoading(true)
        try {
            const { data } = await axios.get(backendUrl + '/api/user/appointments', { headers: { token } })
            setAppointments(data.appointments.reverse())
        } catch (error) {
            console.log(error)
            toast.error(error.message || 'Failed to load appointments')
        } finally {
            setIsLoading(false)
        }
    }

    // Function to handle the cancel button click
    const handleCancelClick = (appointment) => {
        setAppointmentToCancel(appointment._id)
        // Set details for the modal
        setSelectedAppointmentDetails({
            doctorName: appointment.docData.name,
            date: appointment.slotDate,
            time: appointment.slotTime
        })
        setShowConfirmModal(true)
    }

    // Function to cancel appointment Using API - now called when confirmation is confirmed
    const cancelAppointment = async () => {
        try {
            const { data } = await axios.post(
                backendUrl + '/api/user/cancel-appointment', 
                { appointmentId: appointmentToCancel }, 
                { headers: { token } }
            )

            if (data.success) {
                toast.success(data.message)
                getUserAppointments()
            } else {
                toast.error(data.message)
            }
            // Close the modal after operation completes
            setShowConfirmModal(false)
            setAppointmentToCancel(null)
            setSelectedAppointmentDetails(null)
        } catch (error) {
            console.log(error)
            toast.error(error.message || 'Failed to cancel appointment')
            setShowConfirmModal(false)
        }
    }

    const initPay = (order) => {
        const options = {
            key: import.meta.env.VITE_RAZORPAY_KEY_ID,
            amount: order.amount,
            currency: order.currency,
            name: 'Appointment Payment',
            description: "Appointment Payment",
            order_id: order.id,
            receipt: order.receipt,
            handler: async (response) => {
                try {
                    const { data } = await axios.post(backendUrl + "/api/user/verifyRazorpay", response, { headers: { token } });
                    if (data.success) {
                        navigate('/my-appointments')
                        getUserAppointments()
                    }
                } catch (error) {
                    console.log(error)
                    toast.error(error.message || 'Payment verification failed')
                }
            }
        };
        const rzp = new window.Razorpay(options);
        rzp.open();
    };

    // Function to make payment using razorpay
    const appointmentRazorpay = async (appointmentId) => {
        try {
            const { data } = await axios.post(backendUrl + '/api/user/payment-razorpay', { appointmentId }, { headers: { token } })
            if (data.success) {
                initPay(data.order)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message || 'Payment initialization failed')
        }
    }

    // Function to make payment using stripe
    const appointmentStripe = async (appointmentId) => {
        try {
            const { data } = await axios.post(backendUrl + '/api/user/payment-stripe', { appointmentId }, { headers: { token } })
            if (data.success) {
                const { session_url } = data
                window.location.replace(session_url)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message || 'Payment initialization failed')
        }
    }

    // Close payment options
    const handleClosePayment = () => {
        setPayment('')
    }

    useEffect(() => {
        if (token) {
            getUserAppointments()
        }
    }, [token])

    return (
        <div className="container mx-auto px-4 sm:px-6 py-20 max-w-6xl">
            {/* Confirmation Modal */}
            <ConfirmationModal 
                isOpen={showConfirmModal}
                onClose={() => {
                    setShowConfirmModal(false)
                    setAppointmentToCancel(null)
                    setSelectedAppointmentDetails(null)
                }}
                onConfirm={cancelAppointment}
                appointmentDetails={selectedAppointmentDetails}
            />
            
            <div className="flex items-center justify-between mb-6 border-b pb-4">
                <h1 className="text-2xl font-bold text-gray-800">My Appointments</h1>
                <button 
                    onClick={getUserAppointments}
                    className="text-sm bg-primary hover:bg-primary/90 text-white py-2 px-4 rounded-md transition-all duration-300"
                >
                    Refresh
                </button>
            </div>

            {isLoading ? (
                <div className="flex justify-center items-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
            ) : appointments.length === 0 ? (
                <div className="bg-gray-50 rounded-lg p-8 text-center">
                    <p className="text-lg text-gray-600">You don't have any appointments yet.</p>
                    <button 
                        onClick={() => navigate('/doctors')}
                        className="mt-4 bg-primary text-white py-2 px-6 rounded-md hover:bg-primary/90 transition-all duration-300"
                    >
                        Find Doctors
                    </button>
                </div>
            ) : (
                <div className="space-y-6">
                    {appointments.map((item, index) => (
                        <div key={index} className="bg-white rounded-lg shadow-sm border overflow-hidden">
                            <div className="p-4 lg:p-6 flex flex-col md:flex-row gap-6">
                                {/* Doctor Image */}
                                <div className="flex justify-center md:justify-start">
                                    <img 
                                        className="w-28 h-28 object-cover rounded-md bg-[#EAEFFF]" 
                                        src={item.docData.image} 
                                        alt={item.docData.name} 
                                    />
                                </div>
                                
                                {/* Appointment Details */}
                                <div className="flex-1">
                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                                        {/* Doctor Info */}
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-800">{item.docData.name}</h3>
                                            <p className="text-primary font-medium">{item.docData.speciality}</p>
                                            
                                            <div className="mt-3">
                                                <p className="text-sm text-gray-700 font-medium">Address:</p>
                                                <p className="text-sm text-gray-600">{item.docData.address.line1}</p>
                                                <p className="text-sm text-gray-600">{item.docData.address.line2}</p>
                                            </div>
                                        </div>
                                        
                                        {/* Date Time & Status */}
                                        <div className="sm:text-right">
                                            <div className="inline-flex items-center px-3 py-1 rounded-full text-sm 
                                                ${item.cancelled ? 'bg-red-100 text-red-600' : 
                                                item.isCompleted ? 'bg-green-100 text-green-600' : 
                                                item.payment ? 'bg-blue-100 text-blue-600' : 'bg-yellow-100 text-yellow-600'}"
                                            >
                                                {item.cancelled ? 'Cancelled' : 
                                                item.isCompleted ? 'Completed' : 
                                                item.payment ? 'Paid' : 'Payment Pending'}
                                            </div>
                                            
                                            <div className="mt-3">
                                                <p className="text-sm text-gray-600 font-medium">Date & Time:</p>
                                                <p className="text-sm text-gray-800 font-medium">
                                                    {slotDateFormat(item.slotDate)} | {item.slotTime}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Actions */}
                                    <div className="mt-4 pt-4 border-t flex flex-wrap gap-3 justify-end">
                                        {!item.cancelled && !item.payment && !item.isCompleted && payment !== item._id && (
                                            <button 
                                                onClick={() => setPayment(item._id)} 
                                                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-all duration-300"
                                            >
                                                Pay Online
                                            </button>
                                        )}
                                        
                                        {!item.cancelled && !item.payment && !item.isCompleted && payment === item._id && (
                                            <div className="w-full flex flex-col sm:flex-row items-center gap-3">
                                                <button 
                                                    onClick={() => appointmentStripe(item._id)} 
                                                    className="w-full sm:w-auto px-6 py-2 bg-white border rounded-md flex items-center justify-center hover:bg-gray-50 transition-all duration-300"
                                                >
                                                    <img className="h-6" src={assets.stripe_logo} alt="Stripe" />
                                                </button>
                                                
                                                <button 
                                                    onClick={() => appointmentRazorpay(item._id)} 
                                                    className="w-full sm:w-auto px-6 py-2 bg-white border rounded-md flex items-center justify-center hover:bg-gray-50 transition-all duration-300"
                                                >
                                                    <img className="h-6" src={assets.razorpay_logo} alt="Razorpay" />
                                                </button>
                                                
                                                <button 
                                                    onClick={handleClosePayment}
                                                    className="w-full sm:w-auto px-4 py-2 text-gray-600 border rounded-md hover:bg-gray-50 transition-all duration-300"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        )}
                                        
                                        {!item.cancelled && !item.isCompleted && payment !== item._id && (
                                            <button 
                                                onClick={() => handleCancelClick(item)} 
                                                className="px-4 py-2 text-red-600 border border-red-600 rounded-md hover:bg-red-600 hover:text-white transition-all duration-300"
                                            >
                                                Cancel Appointment
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default MyAppointments