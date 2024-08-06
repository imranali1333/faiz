// src/sessionConfig.ts
import session from 'express-session';
import PgSession from 'connect-pg-simple';
import pg from 'pg';

// PostgreSQL client for connect-pg-simple
const pgPool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

// Session store using PostgreSQL
const PgStore = PgSession(session);

// Configure session middleware
const sessionMiddleware = session({
  store: new PgStore({
    pool: pgPool,
    tableName: 'sessions',
  }),
  secret: process.env.SECRET || 'default_secret', // Provide a fallback default value
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production', // Set to true if using HTTPS
  },
});

export default sessionMiddleware;
