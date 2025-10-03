module.exports = {
  apps: [
    {
      name: "server",
      script: "dist/Server.js",
      watch: false,
    },
    {
      name: "bot",
      script: "dist/Bot.js",
      watch: false,
    },
  ],
};
