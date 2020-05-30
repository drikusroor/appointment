const createConfig = require("./create-config");
const scheduler = require("./scheduler");

module.exports = function (clients, userConfig) {
  const config = createConfig(userConfig);
  return scheduler(clients, config);
};
