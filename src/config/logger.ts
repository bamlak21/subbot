import winston from "winston";

const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "subbot.log", level: "warn" }),
  ],
});

logger.info("Sup");
logger.warn("I will find u");
logger.error("my dih nah worhin");

// export default logger;
