const moment = require("moment");
const needsAppointment = require("./needs-appointment");

module.exports = function (clients, config) {
  const { endDate, clientIdentifier, startDate, tick } = config;

  let currentDate = startDate;
  let currentClients = clients;
  let appointments = [];

  while (moment(currentDate).isBefore(moment(endDate))) {
    isAvailable = !appointments.some(
      (appointment) =>
        moment(appointment.start).isBefore(moment(currentDate)) &&
        moment(appointment.end).isAfter(moment(currentDate))
    );

    const client = currentClients.find((client) =>
      needsAppointment(client, config, currentDate)
    );

    if (isAvailable && client) {
      const appointmentLength =
        client.appointmentLength || config.appointmentLength;
      const start = currentDate;
      const end = moment(currentDate).add(
        appointmentLength.amount,
        appointmentLength.unit
      );
      clientIdentifier;
      appointments.push({
        name: `Appointment for ${client[clientIdentifier]}`,
        start,
        end,
      });
      currentClients = currentClients.map((cClient) => {
        if (cClient[clientIdentifier] === client[clientIdentifier]) {
          cClient.lastAppointment = currentDate;
        }
        return cClient;
      });
    }

    currentDate = moment(currentDate).add(tick.amount, tick.unit);
  }

  return appointments;
};
