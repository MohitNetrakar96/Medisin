import jwt from "jsonwebtoken";
import appointmentModel from "../models/appointmentModel.js";
import doctorModel from "../models/doctorModel.js";
import bcrypt from "bcrypt";
import validator from "validator";
import { v2 as cloudinary } from "cloudinary";
import userModel from "../models/userModel.js";
import { sendEmail, generateResetToken } from '../utils/emailService.js';
import adminModel from "../models/adminModel.js";

// API for admin login
const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const admin = await adminModel.findOne({ email });

        if (!admin) {
            return res.json({ success: false, message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.json({ success: false, message: "Invalid credentials" });
        }

        const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET);
        res.json({ success: true, token });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// API to get all appointments list
const appointmentsAdmin = async (req, res) => {
    try {

        const appointments = await appointmentModel.find({})
        res.json({ success: true, appointments })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

// API for appointment cancellation
const appointmentCancel = async (req, res) => {
    try {

        const { appointmentId } = req.body
        await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true })

        res.json({ success: true, message: 'Appointment Cancelled' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

// API for adding Doctor
const addDoctor = async (req, res) => {

    try {

        const { name, email, password, speciality, degree, experience, about, fees, address } = req.body
        const imageFile = req.file

        // checking for all data to add doctor
        if (!name || !email || !password || !speciality || !degree || !experience || !about || !fees || !address) {
            return res.json({ success: false, message: "Missing Details" })
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

        // upload image to cloudinary
        const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" })
        const imageUrl = imageUpload.secure_url

        const doctorData = {
            name,
            email,
            image: imageUrl,
            password: hashedPassword,
            speciality,
            degree,
            experience,
            about,
            fees,
            address: JSON.parse(address),
            date: Date.now()
        }

        const newDoctor = new doctorModel(doctorData)
        await newDoctor.save()
        res.json({ success: true, message: 'Doctor Added' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get all doctors list for admin panel
const allDoctors = async (req, res) => {
    try {

        const doctors = await doctorModel.find({}).select('-password')
        res.json({ success: true, doctors })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get dashboard data for admin panel
const adminDashboard = async (req, res) => {
    try {

        const doctors = await doctorModel.find({})
        const users = await userModel.find({})
        const appointments = await appointmentModel.find({})

        const dashData = {
            doctors: doctors.length,
            appointments: appointments.length,
            patients: users.length,
            latestAppointments: appointments.reverse()
        }

        res.json({ success: true, dashData })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// Add forgot password functionality
const forgotPasswordAdmin = async (req, res) => {
    try {
        const { email } = req.body;
        const admin = await adminModel.findOne({ email });
        
        if (!admin) {
            return res.json({ success: false, message: 'Admin not found' });
        }

        const resetToken = generateResetToken();
        admin.resetToken = resetToken;
        admin.resetTokenExpiry = Date.now() + 3600000; // 1 hour
        await admin.save();

        const resetUrl = `${process.env.ADMIN_FRONTEND_URL}/reset-password-admin?token=${encodeURIComponent(resetToken)}`;
        
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
            'MEDISIN - Admin Password Reset Request',
            emailText,
            emailHtml
        );

        if (emailSent) {
            res.json({ success: true, message: 'Reset email sent, Check Your Email.' });
        } else {
            res.json({ success: false, message: 'Failed to send email. Please try again later.' });
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Add reset password functionality
const resetPasswordAdmin = async (req, res) => {
    try {
        const { token, newPassword } = req.body;
        const admin = await adminModel.findOne({ 
            resetToken: token,
            resetTokenExpiry: { $gt: Date.now() }
        });

        if (!admin) {
            return res.json({ success: false, message: 'Invalid or expired token' });
        }

        const salt = await bcrypt.genSalt(10);
        admin.password = await bcrypt.hash(newPassword, salt);
        admin.resetToken = undefined;
        admin.resetTokenExpiry = undefined;
        await admin.save();

        res.json({ success: true, message: 'Password reset successful' });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// New admin registration API
const registerAdmin = async (req, res) => {
    try {
        const { email, password, secretKey } = req.body;
        
        // Validate secret key from .env
        if (secretKey !== process.env.ADMIN_SECRET_KEY) {
            return res.status(401).json({ success: false, message: "Invalid secret key" });
        }

        // Validate email format
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Invalid email format" });
        }

        // Check if admin already exists
        const existingAdmin = await adminModel.findOne({ email });
        if (existingAdmin) {
            return res.json({ success: false, message: "Admin already exists" });
        }

        // Create new admin
        const newAdmin = new adminModel({ email, password });
        await newAdmin.save();

        res.json({ success: true, message: "Admin created successfully" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

export {
    loginAdmin,
    appointmentsAdmin,
    appointmentCancel,
    addDoctor,
    allDoctors,
    adminDashboard,
    forgotPasswordAdmin,
    resetPasswordAdmin,
    registerAdmin
}
