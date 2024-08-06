import session from 'express-session';

const sessionConfig = session({
  secret: process.env.SECRET || 'default_secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
  },
});

export default sessionConfig;
