const Logger = require("logplease");

const DEFAULT_DEBUG_LEVEL = "NONE"
const DEBUG_OPTIONS = ["DEBUG", "INFO", "WARN", "ERROR", "NONE"]

Logger.setLogLevel(DEFAULT_DEBUG_LEVEL);

const debugLevel = process.env.DEBUG_LEVEL && process.env.DEBUG_LEVEL.toUpperCase();

if (debugLevel && DEBUG_OPTIONS.indexOf(debugLevel) > -1) {
  Logger.setLogLevel(debugLevel);
}

export default Logger.create("utils");
