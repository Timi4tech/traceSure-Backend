
const  winston = require ('winston');
require ('winston-daily-rotate-file')

// 1. Define custom filtering logic for explicit error categories
const filterByType = (type) => {
  return winston.format((info) => {
    return info.errorType === type ? info : false;
  })();
};

// Helper to generate rotation configurations quickly
const createRotateTransport = (filename, level, customFilter = null) => {
  const formats = [
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.json()
  ];
  

  if (customFilter) formats.unshift(customFilter);

  return new winston.transports.DailyRotateFile({
    filename: `logs/${filename}-%DATE%.log`,
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d',
    level: level,
    format: winston.format.combine(...formats)
  });
};

// 2. Initialize separate file destinations based on error targets
const databaseErrorTransport = createRotateTransport('database-errors', 'error', filterByType('DatabaseError'));
const otherErrorTransport =  createRotateTransport('general-errors', "error",filterByType("OtherError"))

const validationErrorTransport = createRotateTransport('validation-errors', 'warn', filterByType('ValidationError'));
const combinedLogTransport = createRotateTransport('combined', 'info');

// 3. Build core logger instance
const logger = winston.createLogger({
  transports: [
    databaseErrorTransport,
    validationErrorTransport,
    combinedLogTransport,
    otherErrorTransport
  ]
});

// Mirror to console for local development environments
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(

      winston.format.colorize(),
      winston.format.simple()
    )
  }));
}

module.exports = logger;
