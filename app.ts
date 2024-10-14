import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import 'express-async-errors';
import connectDB from './db/connect';

// Import routers
import blogsRouter from './routes/blog';
import authRouter from './routes/auth';

// Import the notFound middleware
import notFound from './middleware/not-found';
// Import the errorHandler middleware
import errorHandlerMiddleware from './middleware/error-handler'



dotenv.config();
const app = express();

app.use(express.json());

// Basic route
app.get('/', (req: Request, res: Response) => {
    res.send('Hello, TypeScript with Express!');
});

// Routers
app.use('/api/v1/blog', blogsRouter);
app.use('/api/v1/auth', authRouter);

// Use the 404 middleware after all routes
app.use(notFound);
app.use(errorHandlerMiddleware);

// Start server code as before
const port = process.env.PORT || 3000;

const startServer = async () => {
    try {
        const mongoURI = process.env.MONGO_URI;

        if (!mongoURI) {
            throw new Error('MONGO_URI is not defined in the environment variables');
        }

        await connectDB(mongoURI);
        console.log('Database connected');

        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    } catch (error) {
        console.error('Error connecting to the database:', error);
    }
};

startServer();
