import cors from 'cors';

const corsForAdmin = (req:any, res:any, next:any) => {
  const origin = req.get('Origin');
  if (origin === 'http://localhost:3000') {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET,PATCH,PUT,POST,DELETE');
    res.header('Access-Control-Expose-Headers', 'Content-Length');
    res.header(
      'Access-Control-Allow-Headers',
      'Accept, Authorization, x-auth-token, Content-Type, X-Requested-With, Range'
    );
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
  }
  next();
};

const corsForUserFrontEnd = cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
});

export { corsForAdmin, corsForUserFrontEnd };
