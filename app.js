
/*
 * Copyright © 2018. All rights reserved.
 *
*/

const express = require('express');
const app = express();

// Bootstrap application settings
require('./config/express')(app);

// Configure the Watson services
require('./routes/conversation')(app);
require('./routes/speech-to-text')(app);
require('./routes/text-to-speech')(app);
require('./routes/visual-recognition')(app);
//require('./routes/image')(app);

// error-handler settings
require('./config/error-handler')(app);

module.exports = app;