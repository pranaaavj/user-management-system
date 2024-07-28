//modules
const express = require('express');
require('dotenv').config();
require('express-async-errors');
const cookieParser = require('cookie-parser');
const nocache = require('nocache');
const methodOverride = require('method-override');
//middlewares
const authenticateUser = require('./middlewares/userAuthenticate');
const authorizeAdmin = require('./middlewares/adminAuth');
const morgan = require('morgan');

const { connectDB } = require('./db/connection');
//errorhandlers
const notFoundMiddleware = require('./middlewares/notFound');
//importing routes
const userRoute = require('./routes/userRoute');
const adminRoute = require('./routes/adminRoute');

const PORT = process.env.PORT || 4000;
const URI = process.env.URI;
const app = express();
//configurations
app.set('view-engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(nocache());
app.use(morgan('dev'));
app.use(methodOverride('_method'));
//main routes
app.use('/api/v1', authenticateUser, userRoute);
app.use('/api/v1/admin', authorizeAdmin, adminRoute);
//undefined routes middleware
app.use(notFoundMiddleware);
//connecting database
connectDB(URI)
  .then(() => console.log(`Connected to DB`))
  .catch((err) => console.log(`ERROR: `, err));
//starting server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/api/v1/`);
});
