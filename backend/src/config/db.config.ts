import mongoose from "mongoose";
import { config } from 'dotenv';

config();

const DB_URI = process.env.MONGODB_URI || '';

const connectToDB = async () => {
    try {
        const con = await mongoose.connect(DB_URI);
        console.log(`Database is running 🖥️✨ ${con.connection.host} `);
    } catch (error) {
        const err = error as Error;
        console.log(`Database isn't working! ❌🤔 Error: ${err.message}`);
        return process.exit(1);
    }
};

export default connectToDB;
