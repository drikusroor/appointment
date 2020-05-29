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

module.exports = function (clientConfig, userConfig, eventStartDate) {
  const {
    constraints: clientConstraints = [],
    eventLength: clientEventLength,
    lastEvent,
    repeatAfter,
  } = clientConfig;
  const {
    constraints: userConstraints = [],
    eventLength: userEventLength,
  } = userConfig;

  // Check if client already needs a new appointment
  const difference = moment(eventStartDate).diff(
    moment(lastEvent),
    repeatAfter.unit
  );

  if (difference < repeatAfter.amount) {
    return false;
  }

  const constraints = [...clientConstraints, ...userConstraints];
  const eventLength = clientEventLength || userEventLength;
  const eventEndDate = moment(eventStartDate).add(
    eventLength.amount,
    eventLength.unit
  );

  // Check if appointment start and end date falls within user's and client's constraints
  if (constraints) {
    const startNotWithinConstraints = constraints.some(
      (constraint) => !isWithinConstraint(constraint, eventStartDate)
    );
    const endNotWithinConstraints = constraints.some(
      (constraint) => !isWithinConstraint(constraint, eventEndDate)
    );
    if (startNotWithinConstraints || endNotWithinConstraints) {
      return false;
    }
  }

  return true;
};
