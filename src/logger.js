const Logger = require('logplease');

Logger.setLogLevel('DEBUG');
module.exports = Logger.create('utils');
