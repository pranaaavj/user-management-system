const express = require('express');
require('dotenv').config();
const nocache = require('nocache');
const cookieParser = require('cookie-parser');
require('express-async-errors');

const authenticateUser = require('./middlewares/userAuthenticate');
const authorizeAdmin = require('./middlewares/adminAuth');
const { connectDB } = require('./db/connection');

const errorHandlerMiddleware = require('./middlewares/errorHandling');
const notFoundMiddleware = require('./middlewares/notFound');

const userRoute = require('./routes/userRoute');
const adminRoute = require('./routes/adminRoute');

const PORT = process.env.PORT || 4000;
const URI = process.env.URI;
const app = express();

app.set('view-engine', 'ejs');
app.use(express.static('views'));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(nocache());

app.use('/api/v1', authenticateUser, userRoute);
app.use('/api/v1/admin', authorizeAdmin, adminRoute);

// app.use(errorHandlerMiddleware);
app.use(notFoundMiddleware);

connectDB(URI)
  .then(() => console.log(`Connected to DB`))
  .catch((err) => console.log(`ERROR: `, err));

app.listen(PORT, () => {
  console.log(`Server is listening at ${PORT}`);
});
