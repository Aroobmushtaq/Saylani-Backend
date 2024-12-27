const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // Use bcryptjs instead of bcrypt for better compatibility

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    userType: { type: String, enum: ['student', 'teacher'], required: true },
    image: { type: String }, // Optional: to store the profile image path
});

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Compare passwords
userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema);