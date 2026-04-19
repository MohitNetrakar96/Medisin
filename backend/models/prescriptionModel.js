import mongoose from "mongoose";

const prescriptionSchema = new mongoose.Schema({
    appointmentId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Appointment',
        required: true 
    },
    medications: [{
        name: { type: String, required: true },
        dosage: { type: String, required: true },
        frequency: { type: String, required: true },
        duration: { type: String, required: true }
    }],
    instructions: { type: String },
    qrCode: { type: String },
    createdAt: { type: Date, default: Date.now }
});

// Export as prescriptionModel instead of Prescription
const prescriptionModel = mongoose.models.prescriptionModel || mongoose.model('prescriptionModel', prescriptionSchema);

export { prescriptionModel }; 