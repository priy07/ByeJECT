import mongoose from 'mongoose';

const connectDB = async () =>{
    try {
        mongoose.connection.on('connected', ()=> console.log('Database connected'))
        // Ensure we don't duplicate slashes or add a DB name if one already exists in the URI
        let uri = (process.env.MONGODB_URI || '').trim();

        // If the URI does not have a non-empty path segment at the end (no DB specified), append '/quickgpt'
        // e.g. '...mongodb.net' or '...mongodb.net/' -> append '/quickgpt'
        // but '...mongodb.net/mydb' should be left as-is.
        const hasDbPath = /\/[^\/\s]+$/.test(uri);
        if (!hasDbPath) {
            uri = uri.replace(/\/+$/, '');
            uri = `${uri}/quickgpt`;
        }

        await mongoose.connect(uri);
    } catch (error) {
        console.log(error.message)
    }
}

export default connectDB;