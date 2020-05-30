const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const moment = require("moment");
const { planAppointments } = require("appointment");

const clients = [
  {
    name: "John",
    lastAppointment: "2019-04-30",
    repeatAfter: { unit: "days", amount: 3 },
  },
  {
    name: "Paul",
    lastAppointment: "2020-03-20",
    repeatAfter: { unit: "days", amount: 2 },
  },
  {
    name: "George",
    lastAppointment: "2019-12-20",
    repeatAfter: { unit: "hours", amount: 3 },
    constraints: [{ type: "period", unit: "hours", min: 13, max: 18 }],
  },
  {
    name: "Ringo",
    lastAppointment: "2020-05-20",
    repeatAfter: { unit: "hours", amount: 4 },
    constraints: [{ type: "weekdays", values: [1, 2, 4, 5] }],
  },
  {
    name: "Brian",
    lastAppointment: "2020-05-29 11:00",
    repeatAfter: { unit: "hours", amount: 5 },
    appointmentLength: { unit: "minutes", amount: 60 },
    constraints: [{ type: "period", unit: "hours", min: 8, max: 12 }],
  },
];

const appointments = planAppointments(clients);

const mappedAppointments = appointments.map((appointment) => ({
  name: appointment.name,
  startDate: moment(appointment.start).format("YYYY/MM/DD"),
  startTime: moment(appointment.start).format("h:mm:ss a"),
  endDate: moment(appointment.end).format("YYYY/MM/DD"),
  endTime: moment(appointment.end).format("h:mm:ss a"),
}));

const csvWriter = createCsvWriter({
  path: "out.csv",
  header: [
    { id: "name", title: "Subject" },
    { id: "startDate", title: "Start Date" },
    { id: "startTime", title: "Start Time" },
    { id: "endDate", title: "End Date" },
    { id: "endTime", title: "End Time" },
  ],
});

csvWriter.writeRecords(mappedAppointments);
