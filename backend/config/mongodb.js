import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      ssl: true,
      serverSelectionTimeoutMS: 5000
    });
    console.log('Database Connected');
  } catch (err) {
    console.error('Connection Failed:', err.message);
    process.exit(1);
  }

  mongoose.connection.on('error', err => {
    console.error('DB Connection Lost:', err);
  });
};

export default connectDB