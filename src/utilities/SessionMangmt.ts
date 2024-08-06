import session from 'express-session';
const { PrismaSessionStore } = require('@quixo3/prisma-session-store');
import prisma from './prismaclient';

const Middlewaresession = session({
  cookie: {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week
  },
  secret: process.env.SESSION_SECRET || 'your-secret',
  resave: false,
  saveUninitialized: true,
  store: new PrismaSessionStore(prisma, {
    checkPeriod: 2 * 60 * 1000,  // 2 minutes
    dbRecordIdIsSessionId: true,
    dbRecordIdFunction: undefined,
  }),
});

export default Middlewaresession;
