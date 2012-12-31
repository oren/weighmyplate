var ejs = require('ejs');

config = {
  port: 3000,
  engine: ejs,
  templates: './templates',
  emailUser: '',
  emailPass: ''
}

module.exports = config;
