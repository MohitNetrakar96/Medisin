import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

export const createPdf = async (billData) => {
    return new Promise(async (resolve, reject) => {
        try {
            const doc = new PDFDocument({ 
                size: 'A4', 
                margins: { 
                    top: 50, 
                    bottom: 50, 
                    left: 50, 
                    right: 50 
                }
            });
            const buffers = [];
            
            doc.on('data', buffers.push.bind(buffers));
            doc.on('end', () => {
                const pdfData = Buffer.concat(buffers);
                resolve(pdfData);
            });

            // Color Palette
            const colors = {
                primary: '#2C3E50',      // Dark Blue-Gray
                secondary: '#34495E',    // Slightly Lighter Blue-Gray
                accent: '#3498DB',       // Bright Blue
                text: '#2C3E50',         // Dark Gray for Text
                background: '#FFFFFF',   // White Background
                lightGray: '#F4F6F7'     // Light Gray for sections
            };

            // Header Section
            const logoPath = path.join(process.cwd(), 'public', 'images', 'MediZen_Logo.png');
            if (fs.existsSync(logoPath)) {
                doc.image(logoPath, 50, 45, { width: 100, align: 'left' });
            } else {
                doc.fillColor(colors.primary)
                   .font('Helvetica-Bold')
                   .fontSize(24)
                   .text('MEDISIN', 50, 50);
            }

            // Bill Date
            doc.font('Helvetica')
               .fontSize(10)
               .fillColor(colors.secondary)
               .text(`Bill Date: ${billData.date}`, doc.page.width - 200, 50, {
                   width: 150,
                   align: 'right'
               });

            // Bill Title
            doc.font('Helvetica-Bold')
               .fontSize(18)
               .fillColor(colors.primary)
               .text('APPOINTMENT BILL', 0, 100, { 
                   align: 'center',
                   underline: true 
               });

            // Decorative Line
            doc.moveTo(50, 130)
               .lineTo(doc.page.width - 50, 130)
               .strokeColor(colors.accent)
               .lineWidth(1)
               .stroke();

            // Sections Background
            doc.rect(50, 150, doc.page.width - 100, 500)
               .fill(colors.lightGray);

            // Patient Information Section
            doc.font('Helvetica-Bold')
               .fontSize(12)
               .fillColor(colors.primary)
               .text('Patient Information', 70, 170);

            doc.font('Helvetica')
               .fontSize(10)
               .fillColor(colors.text)
               .text(`Name: ${billData.patientName}`, 70, 190)
               .text(`Contact: ${billData.patientContact || 'N/A'}`, 70, 205);

            // Doctor Information Section
            doc.font('Helvetica-Bold')
               .fontSize(12)
               .fillColor(colors.primary)
               .text('Doctor Information', 70, 230);

            doc.font('Helvetica')
               .fontSize(10)
               .fillColor(colors.text)
               .text(`Name: ${billData.doctorName}`, 70, 250)
               .text(`Specialization: ${billData.specialization}`, 70, 265);

            // Appointment Details Section
            doc.font('Helvetica-Bold')
               .fontSize(12)
               .fillColor(colors.primary)
               .text('Appointment Details', 70, 290);

            doc.font('Helvetica')
               .fontSize(10)
               .fillColor(colors.text)
               .text(`Date: ${billData.appointmentDate}`, 70, 310)
               .text(`Time: ${billData.appointmentTime}`, 70, 325);

            // Billing Information Section
            doc.font('Helvetica-Bold')
               .fontSize(12)
               .fillColor(colors.primary)
               .text('Billing Information', 70, 350);

            doc.font('Helvetica')
               .fontSize(10)
               .fillColor(colors.text)
               .text(`Appointment ID: ${billData.appointmentId}`, 70, 370)
               .text(`Amount: ₹${billData.amount}`, 70, 385)
               .text(`Payment Status: ${billData.paymentStatus}`, 70, 400);

           

            // Footer
            doc.font('Helvetica')
               .fontSize(10)
               .fillColor(colors.secondary)
               .text('Thank you for choosing MEDISIN Healthcare', 0, doc.page.height - 100, {
                   align: 'center'
               })
               .text('For support: support@medisin.com | +91 1234567890', 0, doc.page.height - 80, {
                   align: 'center'
               });

            // Page Number
            doc.font('Helvetica')
               .fontSize(8)
               .fillColor(colors.secondary)
               .text(`Page 1 of 1`, 50, doc.page.height - 50);

            doc.end();
        } catch (error) {
            reject(error);
        }
    });
};

export default createPdf;
