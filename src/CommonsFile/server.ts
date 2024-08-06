import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import http from 'http';
import { corsForAdmin, corsForUserFrontEnd } from './config/cors';
import sessionConfig from './config/session';
import sessionMiddleware from './middleware/sessionMiddleware';
import { errorHandler } from '../validations/Api/Telegram/errorhandling';
import routes from '../CommonsFile/routes/routes';
import setupSocketServer from '../CommonsFile/socket/index';
import dotenv from 'dotenv';

dotenv.config({ path: '.variables.env' });

const app = express();

app.use(corsForAdmin);
app.use(corsForUserFrontEnd);
app.use(sessionMiddleware);

app.use(express.json());
app.use(morgan('combined'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use(routes);

// Error handlers
app.use(errorHandler);
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    result: null,
    message: 'Not Found',
  });
});
if (app.get('env') === 'development') {
  app.use((err: any, req: any, res: any, next: any) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
      success: false,
      result: null,
      message: err.message,
    });
  });
}
app.use((err: any, req: any, res: any, next: any) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    result: null,
    message: 'Internal Server Error',
  });
});

const PORT = process.env.PORT || 8080;
const server = http.createServer(app);
setupSocketServer(server);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
