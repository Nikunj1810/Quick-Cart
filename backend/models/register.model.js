import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    phone: String,
    address: String,
    email: String,
    password: String
}, { timestamps: true });

const QuickcartModel = mongoose.model('User', userSchema);

export default QuickcartModel;