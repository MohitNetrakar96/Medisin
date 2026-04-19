import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import doctorModel from "../models/doctorModel.js";
import appointmentModel from "../models/appointmentModel.js";
import { sendEmail, generateResetToken } from '../utils/emailService.js';

// API for doctor Login 
const loginDoctor = async (req, res) => {

    try {

        const { email, password } = req.body
        const doctor = await doctorModel.findOne({ email })

        if (!doctor) {
            return res.json({ success: false, message: "Invalid credentials" })
        }

        const isMatch = await bcrypt.compare(password, doctor.password)

        if (isMatch) {
            const token = jwt.sign({ id: doctor._id }, process.env.JWT_SECRET)
            res.json({ success: true, token })
        } else {
            res.json({ success: false, message: "Invalid credentials" })
        }


    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get doctor appointments for doctor panel
const appointmentsDoctor = async (req, res) => {
    try {

        const { docId } = req.body
        const appointments = await appointmentModel.find({ docId })

        res.json({ success: true, appointments })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to cancel appointment for doctor panel
const appointmentCancel = async (req, res) => {
    try {

        const { docId, appointmentId } = req.body

        const appointmentData = await appointmentModel.findById(appointmentId)
        if (appointmentData && appointmentData.docId === docId) {
            await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true })
            return res.json({ success: true, message: 'Appointment Cancelled' })
        }

        res.json({ success: false, message: 'Appointment Cancelled' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

// API to mark appointment completed for doctor panel
const appointmentComplete = async (req, res) => {
    try {

        const { docId, appointmentId } = req.body

        const appointmentData = await appointmentModel.findById(appointmentId)
        if (appointmentData && appointmentData.docId === docId) {
            await appointmentModel.findByIdAndUpdate(appointmentId, { isCompleted: true })
            return res.json({ success: true, message: 'Appointment Completed' })
        }

        res.json({ success: false, message: 'Appointment Cancelled' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

// API to get all doctors list for Frontend
const doctorList = async (req, res) => {
    try {

        const doctors = await doctorModel.find({}).select(['-password', '-email'])
        res.json({ success: true, doctors })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

// API to change doctor availablity for Admin and Doctor Panel
const changeAvailablity = async (req, res) => {
    try {

        const { docId } = req.body

        const docData = await doctorModel.findById(docId)
        await doctorModel.findByIdAndUpdate(docId, { available: !docData.available })
        res.json({ success: true, message: 'Availablity Changed' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get doctor profile for  Doctor Panel
const doctorProfile = async (req, res) => {
    try {

        const { docId } = req.body
        const profileData = await doctorModel.findById(docId).select('-password')

        res.json({ success: true, profileData })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to update doctor profile data from  Doctor Panel
const updateDoctorProfile = async (req, res) => {
    try {

        const { docId, fees, address, available } = req.body

        await doctorModel.findByIdAndUpdate(docId, { fees, address, available })

        res.json({ success: true, message: 'Profile Updated' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get dashboard data for doctor panel
const doctorDashboard = async (req, res) => {
    try {

        const { docId } = req.body

        const appointments = await appointmentModel.find({ docId })

        let earnings = 0

        appointments.map((item) => {
            if (item.isCompleted || item.payment) {
                earnings += item.amount
            }
        })

        let patients = []

        appointments.map((item) => {
            if (!patients.includes(item.userId)) {
                patients.push(item.userId)
            }
        })



        const dashData = {
            earnings,
            appointments: appointments.length,
            patients: patients.length,
            latestAppointments: appointments.reverse()
        }

        res.json({ success: true, dashData })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const forgotPasswordDoctor = async (req, res) => {
    try {
        const { email } = req.body;
        const doctor = await doctorModel.findOne({ email });
        
        if (!doctor) {
            return res.json({ success: false, message: 'Doctor not found' });
        }

        const resetToken = generateResetToken();
        doctor.resetToken = resetToken;
        doctor.resetTokenExpiry = Date.now() + 3600000; // 1 hour
        await doctor.save();

        const resetUrl = `${process.env.ADMIN_FRONTEND_URL}/reset-password-doctor?token=${encodeURIComponent(resetToken)}`;
        const emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="text-align: center; padding: 20px;">
                <img src="https://drive.google.com/file/d/1-WpsVoLmA1pV1BPJ7VBmISr8Hp6H_5QM/view?usp=sharing" alt="MEDISIN Logo" style="max-width: 150px;">
            </div>
            <div style="background: #f8f9fa; padding: 30px; border-radius: 8px;">
                <h1 style="color: #2d3748; font-size: 24px; margin-bottom: 20px; text-align: center;">
                    Doctor Password Reset Request
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
            'MEDISIN - Doctor Password Reset Request',
            emailText,
            emailHtml
        );

        if (emailSent) {
            console.log('Reset email sent to:', email);
            res.json({ success: true, message: 'Doctor Reset email sent, Check Your Email.' });
        } else {
            console.error('Failed to send email to:', email);
            res.json({ success: false, message: 'Failed to send email. Please try again later.' });
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

const resetPasswordDoctor = async (req, res) => {
    try {
        const { token, newPassword } = req.body;
        const doctor = await doctorModel.findOne({ 
            resetToken: token,
            resetTokenExpiry: { $gt: Date.now() }
        });

        if (!doctor) {
            return res.json({ success: false, message: 'Invalid or expired token' });
        }

        const salt = await bcrypt.genSalt(10);
        doctor.password = await bcrypt.hash(newPassword, salt);
        doctor.resetToken = undefined;
        doctor.resetTokenExpiry = undefined;
        await doctor.save();

        res.json({ success: true, message: 'Password reset successful' });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

const verifyResetTokenDoctor = async (req, res) => {
    try {
        const { token } = req.body;
        const doctor = await doctorModel.findOne({ 
            resetToken: token,
            resetTokenExpiry: { $gt: Date.now() }
        });

        if (doctor) {
            res.json({ success: true });
        } else {
            res.json({ success: false, message: 'Invalid or expired token' });
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

export {
    loginDoctor,
    appointmentsDoctor,
    appointmentCancel,
    doctorList,
    changeAvailablity,
    appointmentComplete,
    doctorDashboard,
    doctorProfile,
    updateDoctorProfile,
    forgotPasswordDoctor,
    resetPasswordDoctor,
    verifyResetTokenDoctor
}
