const mongoose = require('mongoose');

connectDB = (URI) => {
  return mongoose.connect(URI);
};

module.exports = {
  connectDB,
};
