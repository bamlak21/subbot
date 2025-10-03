module.exports = {
  apps: [
    {
      name: "server",
      script: "dist/server.js",
      watch: false
    },
    {
      name: "bot",
      script: "dist/bot.js",
      watch: false
    }
  ]
}
