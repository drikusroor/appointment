const moment = require("moment");

module.exports = function (config) {
  const {
    eventLength = { unit: "minutes", amount: 60 },
    constraints = [
      { type: "period", unit: "hours", min: 9, max: 18 },
      { type: "weekdays", values: [1, 2, 3, 4, 5] },
      { exclusive: true, type: "period", unit: "hours", min: 12, max: 13 },
    ],
    endDate = moment().add(2, "week").hour(0).minute(0).second(0),
    clientIdentifier = "name",
    startDate = moment().hour(0).minute(0).second(0),
    tick = { unit: "minutes", amount: 15 },
  } = config || {};

  return {
    ...config,
    eventLength,
    clientIdentifier,
    constraints,
    endDate,
    startDate,
    tick,
  };
};
