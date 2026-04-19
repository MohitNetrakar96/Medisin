import { sendEmail } from '../utils/emailService.js';

export const contactUs = async (req, res) => {
    try {
        const { name, email, message } = req.body;
        
        // Validate input
        if (!name || !email || !message) {
            return res.status(400).json({ 
                success: false, 
                message: 'All fields are required' 
            });
        }

        // Send email
        const emailSent = await sendEmail(
            process.env.CONTACT_EMAIL,
            `Contact Form Submission from ${name}`,
            `From: ${email}\n\n${message}`,
            `<p>From: ${email}</p><p>${message}</p>`
        );

        if (emailSent) {
            res.json({ 
                success: true, 
                message: 'Message sent successfully' 
            });
        } else {
            res.status(500).json({ 
                success: false, 
                message: 'Failed to send message' 
            });
        }
    } catch (error) {
        console.error('Contact form error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'An error occurred while processing your request' 
        });
    }
}; 