const moment = require("moment");

function isWithinConstraint(constraint, dateObject) {
  const { exclusive, type } = constraint;

  if (type === "period") {
    const { min, max, unit } = constraint;

    return (
      !exclusive ===
      (moment(dateObject).get(unit) >= min &&
        moment(dateObject).get(unit) <= max)
    );
  } else if (type === "weekdays") {
    const { values } = constraint;
    return (
      !exclusive ===
      values.some((weekday) => weekday === moment(dateObject).get("weekday"))
    );
  } else {
    return true; // todo
  }
}

module.exports = function (clientConfig, userConfig, appointmentStartDate) {
  const {
    constraints: clientConstraints = [],
    appointmentLength: clientAppointmentLength,
    lastAppointment,
    repeatAfter,
  } = clientConfig;
  const {
    constraints: userConstraints = [],
    appointmentLength: userAppointmentLength,
  } = userConfig;

  // Check if client already needs a new appointment
  const difference = moment(appointmentStartDate).diff(
    moment(lastAppointment),
    repeatAfter.unit
  );

  if (difference < repeatAfter.amount) {
    return false;
  }

  const constraints = [...clientConstraints, ...userConstraints];
  const appointmentLength = clientAppointmentLength || userAppointmentLength;
  const appointmentEndDate = moment(appointmentStartDate).add(
    appointmentLength.amount,
    appointmentLength.unit
  );

  // Check if appointment start and end date falls within user's and client's constraints
  if (constraints) {
    const startNotWithinConstraints = constraints.some(
      (constraint) => !isWithinConstraint(constraint, appointmentStartDate)
    );
    const endNotWithinConstraints = constraints.some(
      (constraint) => !isWithinConstraint(constraint, appointmentEndDate)
    );
    if (startNotWithinConstraints || endNotWithinConstraints) {
      return false;
    }
  }

  return true;
};
