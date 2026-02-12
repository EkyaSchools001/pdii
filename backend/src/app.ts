import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import routes from './api/routes';
import { globalAppErrorHandler } from './api/middlewares/errorHandler';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

dotenv.config();

const app: Application = express();

// Middlewares
app.use(helmet());
app.use(cors({
    origin: [
        'http://localhost:8081',
        'http://localhost:8080',
        'http://127.0.0.1:8080',
        'http://localhost:5173',
        'http://localhost:3000',
        process.env.FRONTEND_URL || '',
        'https://brave-aliens-sleep.loca.lt',
        'https://sad-days-knock.loca.lt',
        'https://tough-hands-refuse.loca.lt',
        /\.loca\.lt$/,  // Allow all localtunnel subdomains
        /\.onrender\.com$/ // Allow all Render subdomains
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Bypass-Tunnel-Reminder']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger Documentation
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'School Growth Hub API',
            version: '1.0.0',
            description: 'API for managing educator observations and professional development',
        },
        servers: [{ url: '/api/v1' }],
    },
    apis: ['./src/api/routes/*.ts'],
};
const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// API Routes
app.use('/api/v1', routes);

// Global Error Handler
app.use(globalAppErrorHandler);

// Health Check
app.get('/health', (req: Request, res: Response) => {
    res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Root route
app.get('/', (req: Request, res: Response) => {
    res.status(200).send('School Growth Hub API is running!');
});

export default app;
