import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";
import userModel from "../models/userModel.js";
import doctorModel from "../models/doctorModel.js";
import appointmentModel from "../models/appointmentModel.js";
import { v2 as cloudinary } from 'cloudinary'
import stripe from "stripe";
import razorpay from 'razorpay';
import { sendEmail, generateResetToken } from '../utils/emailService.js';
import { createPdf } from '../utils/pdfGenerator.js';

// Gateway Initialize
const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY)
const razorpayInstance = new razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
})

// API to register user
const registerUser = async (req, res) => {

    try {
        const { name, email, password } = req.body;

        // checking for all data to register user
        if (!name || !email || !password) {
            return res.json({ success: false, message: 'Missing Details' })
        }

        // validating email format
        if (!validator.isEmail(email)) {    
            return res.json({ success: false, message: "Please enter a valid email" })
        }

        // validating strong password
        if (password.length < 8) {
            return res.json({ success: false, message: "Please enter a strong password" })
        }

        // hashing user password
        const salt = await bcrypt.genSalt(10); // the more no. round the more time it will take
        const hashedPassword = await bcrypt.hash(password, salt)

        const userData = {
            name,
            email,
            password: hashedPassword,
        }

        const newUser = new userModel(userData)
        const user = await newUser.save()
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)

        res.json({ success: true, token })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to login user
const loginUser = async (req, res) => {

    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email })

        if (!user) {
            return res.json({ success: false, message: "User does not exist" })
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (isMatch) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
            res.json({ success: true, token })
        }
        else {
            res.json({ success: false, message: "Invalid credentials" })
        }
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get user profile data
const getProfile = async (req, res) => {

    try {
        const { userId } = req.body
        const userData = await userModel.findById(userId).select('-password')

        res.json({ success: true, userData })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to update user profile
const updateProfile = async (req, res) => {

    try {

        const { userId, name, phone, address, dob, gender } = req.body
        const imageFile = req.file

        if (!name || !phone || !dob || !gender) {
            return res.json({ success: false, message: "Data Missing" })
        }

        await userModel.findByIdAndUpdate(userId, { name, phone, address: JSON.parse(address), dob, gender })

        if (imageFile) {

            // upload image to cloudinary
            const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" })
            const imageURL = imageUpload.secure_url

            await userModel.findByIdAndUpdate(userId, { image: imageURL })
        }

        res.json({ success: true, message: 'Profile Updated' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to book appointment 
const bookAppointment = async (req, res) => {

    try {

        const { userId, docId, slotDate, slotTime } = req.body
        const docData = await doctorModel.findById(docId).select("-password")

        if (!docData.available) {
            return res.json({ success: false, message: 'Doctor Not Available' })
        }

        let slots_booked = docData.slots_booked

        // checking for slot availablity 
        if (slots_booked[slotDate]) {
            if (slots_booked[slotDate].includes(slotTime)) {
                return res.json({ success: false, message: 'Slot Not Available' })
            }
            else {
                slots_booked[slotDate].push(slotTime)
            }
        } else {
            slots_booked[slotDate] = []
            slots_booked[slotDate].push(slotTime)
        }

        const userData = await userModel.findById(userId).select("-password")

        delete docData.slots_booked

        const appointmentData = {
            userId,
            docId,
            userData,
            docData,
            amount: docData.fees,
            slotTime,
            slotDate,
            date: Date.now()
        }

        const newAppointment = new appointmentModel(appointmentData)
        await newAppointment.save()

        // save new slots data in docData
        await doctorModel.findByIdAndUpdate(docId, { slots_booked })

        // After saving the appointment
        const emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="text-align: center; padding: 20px;">
                <img src="https://drive.google.com/file/d/1-WpsVoLmA1pV1BPJ7VBmISr8Hp6H_5QM/view?usp=sharing" alt="MEDISIN Logo" style="max-width: 150px;">
            </div>
            <div style="background: #f8f9fa; padding: 30px; border-radius: 8px;">
                <h1 style="color: #2d3748; font-size: 24px; margin-bottom: 20px; text-align: center;">
                    Appointment Confirmation
                </h1>
                <p style="color: #4a5568; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
                    Dear ${userData.name},<br>
                    Your appointment has been successfully booked. Here are the details:
                </p>
                
                <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                    <h2 style="color: #2d3748; font-size: 20px; margin-bottom: 15px;">Appointment Details</h2>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                        <div>
                            <p style="color: #718096; font-size: 14px; margin: 0;">Doctor Name</p>
                            <p style="color: #2d3748; font-size: 16px; margin: 0;">${docData.name}</p>
                        </div>
                        <div>
                            <p style="color: #718096; font-size: 14px; margin: 0;">Specialization</p>
                            <p style="color: #2d3748; font-size: 16px; margin: 0;">${docData.speciality}</p>
                        </div>
                        <div>
                            <p style="color: #718096; font-size: 14px; margin: 0;">Date</p>
                            <p style="color: #2d3748; font-size: 16px; margin: 0;">${slotDate}</p>
                        </div>
                        <div>
                            <p style="color: #718096; font-size: 14px; margin: 0;">Time</p>
                            <p style="color: #2d3748; font-size: 16px; margin: 0;">${slotTime}</p>
                        </div>
                    </div>
                </div>

                <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                    <h2 style="color: #2d3748; font-size: 20px; margin-bottom: 15px;">Billing Information</h2>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                        <div>
                            <p style="color: #718096; font-size: 14px; margin: 0;">Appointment ID</p>
                            <p style="color: #2d3748; font-size: 16px; margin: 0;">${newAppointment._id}</p>
                        </div>
                        <div>
                            <p style="color: #718096; font-size: 14px; margin: 0;">Total Amount</p>
                            <p style="color: #2d3748; font-size: 16px; margin: 0;">₹${appointmentData.amount}</p>
                        </div>
                        <div>
                            <p style="color: #718096; font-size: 14px; margin: 0;">Payment Status</p>
                            <p style="color: #2d3748; font-size: 16px; margin: 0;">${newAppointment.payment ? 'Paid' : 'Pending'}</p>
                        </div>
                    </div>
                </div>

                <p style="color: #718096; font-size: 14px; margin-top: 30px;">
                    Please arrive 10 minutes before your scheduled time. If you need to cancel or reschedule, 
                    please do so at least 24 hours in advance.
                </p>
            </div>
            <div style="text-align: center; padding: 20px; color: #718096; font-size: 14px;">
                © ${new Date().getFullYear()} MEDISIN. All rights reserved.
            </div>
        </div>
        `;

        // Generate PDF bill
        const billData = {
            patientName: userData.name,
            doctorName: docData.name,
            specialization: docData.speciality,
            appointmentDate: slotDate,
            appointmentTime: slotTime,
            appointmentId: newAppointment._id,
            amount: appointmentData.amount,
            paymentStatus: newAppointment.payment ? 'Paid' : 'Pending',
            date: new Date().toLocaleDateString()
        };

        const emailText = `Appointment Confirmation\n\n
        Dear ${userData.name},\n
        Your appointment has been successfully booked.\n\n
        Doctor: ${docData.name}\n
        Specialization: ${docData.speciality}\n
        Date: ${slotDate}\n
        Time: ${slotTime}\n
        Amount: ₹${appointmentData.amount}\n
        Payment Status: ${newAppointment.payment ? 'Paid' : 'Pending'}\n\n
        Please arrive 10 minutes before your scheduled time.`;

        const pdfBuffer = await createPdf(billData);

        await sendEmail(
            userData.email,
            'MEDISIN - Appointment Confirmation',
            emailText,
            emailHtml,
            [{
                filename: `MEDISIN_Bill_${newAppointment._id}.pdf`,
                content: pdfBuffer,
                contentType: 'application/pdf'
            }]
        );

        res.json({ success: true, message: 'Appointment Booked' });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// API to cancel appointment
const cancelAppointment = async (req, res) => {
    try {

        const { userId, appointmentId } = req.body
        const appointmentData = await appointmentModel.findById(appointmentId)

        // verify appointment user 
        if (appointmentData.userId !== userId) {
            return res.json({ success: false, message: 'Unauthorized action' })
        }

        await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true })

        // releasing doctor slot 
        const { docId, slotDate, slotTime } = appointmentData

        const doctorData = await doctorModel.findById(docId)

        let slots_booked = doctorData.slots_booked

        slots_booked[slotDate] = slots_booked[slotDate].filter(e => e !== slotTime)

        await doctorModel.findByIdAndUpdate(docId, { slots_booked })

        res.json({ success: true, message: 'Appointment Cancelled' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get user appointments for frontend my-appointments page
const listAppointment = async (req, res) => {
    try {

        const { userId } = req.body
        const appointments = await appointmentModel.find({ userId })

        res.json({ success: true, appointments })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to make payment of appointment using razorpay
const paymentRazorpay = async (req, res) => {
    try {

        const { appointmentId } = req.body
        const appointmentData = await appointmentModel.findById(appointmentId)

        if (!appointmentData || appointmentData.cancelled) {
            return res.json({ success: false, message: 'Appointment Cancelled or not found' })
        }

        // creating options for razorpay payment
        const options = {
            amount: appointmentData.amount * 100,
            currency: process.env.CURRENCY,
            receipt: appointmentId,
        }

        // creation of an order
        const order = await razorpayInstance.orders.create(options)

        res.json({ success: true, order })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to verify payment of razorpay
const verifyRazorpay = async (req, res) => {
    try {
        const { razorpay_order_id } = req.body
        const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id)

        if (orderInfo.status === 'paid') {
            await appointmentModel.findByIdAndUpdate(orderInfo.receipt, { payment: true })
            res.json({ success: true, message: "Payment Successful" })
        }
        else {
            res.json({ success: false, message: 'Payment Failed' })
        }
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to make payment of appointment using Stripe
const paymentStripe = async (req, res) => {
    try {

        const { appointmentId } = req.body
        const { origin } = req.headers

        const appointmentData = await appointmentModel.findById(appointmentId)

        if (!appointmentData || appointmentData.cancelled) {
            return res.json({ success: false, message: 'Appointment Cancelled or not found' })
        }

        const currency = process.env.CURRENCY.toLocaleLowerCase()

        const line_items = [{
            price_data: {
                currency,
                product_data: {
                    name: "Appointment Fees"
                },
                unit_amount: appointmentData.amount * 100
            },
            quantity: 1
        }]

        const session = await stripeInstance.checkout.sessions.create({
            success_url: `${origin}/verify?success=true&appointmentId=${appointmentData._id}`,
            cancel_url: `${origin}/verify?success=false&appointmentId=${appointmentData._id}`,
            line_items: line_items,
            mode: 'payment',
        })

        res.json({ success: true, session_url: session.url });

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const verifyStripe = async (req, res) => {
    try {

        const { appointmentId, success } = req.body

        if (success === "true") {
            await appointmentModel.findByIdAndUpdate(appointmentId, { payment: true })
            return res.json({ success: true, message: 'Payment Successful' })
        }

        res.json({ success: false, message: 'Payment Failed' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

// Forgot password request
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }

        const resetToken = generateResetToken();
        user.resetToken = resetToken;
        user.resetTokenExpiry = Date.now() + 3600000; // 1 hour
        await user.save();

        const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

        const emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="text-align: center; padding: 20px;">
                <img src="https://drive.google.com/file/d/1-WpsVoLmA1pV1BPJ7VBmISr8Hp6H_5QM/view?usp=sharing" alt="MEDISIN Logo" style="max-width: 150px;">
            </div>
            <div style="background: #f8f9fa; padding: 30px; border-radius: 8px;">
                <h1 style="color: #2d3748; font-size: 24px; margin-bottom: 20px; text-align: center;">
                    Password Reset Request
                </h1>
                <p style="color: #4a5568; font-size: 16px; line-height: 1.5; margin-bottom: 30px;">
                    We received a request to reset your MEDISIN account password. Click the button below to reset it. 
                    This link will expire in 1 hour.
                </p>
                <div style="text-align: center;">
                    <a href="${resetUrl}" 
                       style="background-color: #4299e1; color: white; padding: 12px 24px; 
                              text-decoration: none; border-radius: 4px; font-size: 16px;
                              display: inline-block;">
                        Reset Your Password
                    </a>
                </div>
                <p style="color: #718096; font-size: 14px; margin-top: 30px;">
                    If you didn't request this, you can safely ignore this email. Your password won't be changed until 
                    you access the link above and create a new one.
                </p>
            </div>
            <div style="text-align: center; padding: 20px; color: #718096; font-size: 14px;">
                © ${new Date().getFullYear()} MEDISIN. All rights reserved.
            </div>
        </div>
        `;

        const emailText = `To reset your MEDISIN password, click this link: ${resetUrl}\n\n` +
            `If you didn't request this, you can safely ignore this email.`;

        const emailSent = await sendEmail(
            email,
            'MEDISIN - Password Reset Request',
            emailText,
            emailHtml
        );

        if (emailSent) {
            console.log('Reset email sent to:', email);
            res.json({ success: true, message: 'Reset email sent' });
        } else {
            console.error('Failed to send email to:', email);
            res.json({ success: false, message: 'Failed to send email. Please try again later.' });
        }
    } catch (error) {
        console.error('Forgot password error:', error);
        res.json({ success: false, message: error.message });
    }
};

// Reset password
const resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;

        // Find user by reset token and check expiry
        const user = await userModel.findOne({
            resetToken: token,
            resetTokenExpiry: { $gt: Date.now() }
        });

        if (!user) {
            return res.json({ success: false, message: 'Invalid or expired token' });
        }

        // Validate password length
        if (newPassword.length < 8) {
            return res.json({ success: false, message: 'Password must be at least 8 characters' });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        user.resetToken = undefined;
        user.resetTokenExpiry = undefined;
        await user.save();

        res.json({ success: true, message: 'Password reset successful' });
    } catch (error) {
        console.error('Reset password error:', error);
        res.json({ success: false, message: error.message });
    }
};

export {
    loginUser,
    registerUser,
    getProfile,
    updateProfile,
    bookAppointment,
    listAppointment,
    cancelAppointment,
    paymentRazorpay,
    verifyRazorpay,
    paymentStripe,
    verifyStripe,
    forgotPassword,
    resetPassword
}
