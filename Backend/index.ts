import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import userRoutes from './routes/userRoutes';
import taskRoutes from './routes/taskRoutes';
import { notFound, errorHandler } from './middleware/errorMiddleware';
dotenv.config();
import connectDB from './config/connectdb';
const app = express();

connectDB();

//app use cors
app.use(cors({
    origin: ['http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); // cookie parser middleware

//Routes
app.use('/api/auth', userRoutes);
app.use('/api/tasks', taskRoutes);


// Error handling middleware
app.use(notFound);  // if we reach this point, it means that the request is not found
app.use(errorHandler); // if we reach this point, it means that there is an error


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});
