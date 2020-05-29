const moment = require("moment");
const needsEvent = require("./needs-event");

module.exports = function (clients, config) {
  const { endDate, clientIdentifier, startDate, tick } = config;

  let currentDate = startDate;
  let currentClients = clients;
  let events = [];

  while (moment(currentDate).isBefore(moment(endDate))) {
    isAvailable = !events.some(
      (event) =>
        moment(event.start).isBefore(moment(currentDate)) &&
        moment(event.end).isAfter(moment(currentDate))
    );

    const client = currentClients.find((client) =>
      needsEvent(client, config, currentDate)
    );

    if (isAvailable && client) {
      const eventLength = client.eventLength || config.eventLength;
      const start = currentDate;
      const end = moment(currentDate).add(eventLength.amount, eventLength.unit);
      clientIdentifier;
      events.push({
        name: `Event for ${client[clientIdentifier]}`,
        start,
        end,
      });
      currentClients = currentClients.map((cClient) => {
        if (cClient[clientIdentifier] === client[clientIdentifier]) {
          cClient.lastEvent = currentDate;
        }
        return cClient;
      });
    }

    currentDate = moment(currentDate).add(tick.amount, tick.unit);
  }

  return events;
};
