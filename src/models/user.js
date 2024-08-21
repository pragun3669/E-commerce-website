const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    googleId: { type: String, unique: true, sparse: true },
    googleName: { type: String }
});


userSchema.methods.validPassword = async function(password) {
    try {
        if (this.password) {
            // Local authentication using bcrypt
            return await bcrypt.compare(password, this.password);
        }
        return false; // Handle case where no local password is set
    } catch (error) {
        throw new Error(error);
    }
};

const User = mongoose.model('User', userSchema);

module.exports = User;
