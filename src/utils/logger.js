'use strict';

const fs = require('fs');
const path = require('path');

// Tạo thư mục logs nếu chưa có
const logsDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m'
};

const getTimestamp = () => new Date().toISOString();

const writeToFile = (level, message) => {
  const logFile = path.join(logsDir, `${new Date().toISOString().split('T')[0]}.log`);
  const logLine = `[${getTimestamp()}] [${level.toUpperCase()}] ${message}\n`;
  fs.appendFileSync(logFile, logLine, 'utf8');
};

const logger = {
  info: (message, ...args) => {
    const msg = args.length ? `${message} ${args.join(' ')}` : message;
    console.log(`${colors.cyan}[INFO]${colors.reset} ${colors.gray}${getTimestamp()}${colors.reset} ${msg}`);
    writeToFile('INFO', msg);
  },
  warn: (message, ...args) => {
    const msg = args.length ? `${message} ${args.join(' ')}` : message;
    console.warn(`${colors.yellow}[WARN]${colors.reset} ${colors.gray}${getTimestamp()}${colors.reset} ${msg}`);
    writeToFile('WARN', msg);
  },
  error: (message, ...args) => {
    const msg = args.length ? `${message} ${JSON.stringify(args)}` : message;
    console.error(`${colors.red}[ERROR]${colors.reset} ${colors.gray}${getTimestamp()}${colors.reset} ${msg}`);
    writeToFile('ERROR', msg);
  },
  success: (message, ...args) => {
    const msg = args.length ? `${message} ${args.join(' ')}` : message;
    console.log(`${colors.green}[SUCCESS]${colors.reset} ${colors.gray}${getTimestamp()}${colors.reset} ${msg}`);
    writeToFile('SUCCESS', msg);
  },
  debug: (message, ...args) => {
    if (process.env.NODE_ENV === 'development') {
      const msg = args.length ? `${message} ${args.join(' ')}` : message;
      console.log(`${colors.blue}[DEBUG]${colors.reset} ${colors.gray}${getTimestamp()}${colors.reset} ${msg}`);
    }
  }
};

module.exports = logger;
