const express = require('express');
require('dotenv').config();
const nocache = require('nocache');
const cookieParser = require('cookie-parser');

const { AuthenticateUser } = require('./middlewares/userAuthenticate');
const { connectDB } = require('./connection');
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

app.use('/', AuthenticateUser, userRoute);
app.use('/admin', adminRoute);

connectDB(URI)
  .then(() => console.log(`Connected to DB`))
  .catch((err) => console.log(`ERROR: `, err));

app.listen(PORT, () => {
  console.log(`Server is listening at ${PORT}`);
});
