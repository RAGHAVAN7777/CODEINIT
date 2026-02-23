import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.js";
import bcrypt from "bcryptjs";

dotenv.config();

const diagnose = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ connected to DB");

        const email = process.argv[2];
        const password = process.argv[3];

        if (!email || !password) {
            const users = await User.find({}, "name email role");
            console.log("Current users in DB:", users);
            process.exit(0);
        }

        const user = await User.findOne({ email });
        if (!user) {
            console.log(`❌ User with email ${email} not found.`);
        } else {
            console.log(`Found user: ${user.name} (${user.role})`);
            const isMatch = await bcrypt.compare(password, user.password_hash);
            console.log(`Password match status: ${isMatch}`);
        }

        await mongoose.disconnect();
    } catch (error) {
        console.error("Error:", error);
    }
};

diagnose();
