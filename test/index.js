const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const moment = require("moment");
const { planEvents } = require("../index");

const clients = [
  {
    name: "John",
    lastEvent: "2019-04-30",
    repeatAfter: { unit: "days", amount: 3 },
  },
  {
    name: "Paul",
    lastEvent: "2020-03-20",
    repeatAfter: { unit: "days", amount: 2 },
  },
  {
    name: "George",
    lastEvent: "2019-12-20",
    repeatAfter: { unit: "hours", amount: 3 },
    constraints: [{ type: "period", unit: "hours", min: 13, max: 18 }],
  },
  {
    name: "Ringo",
    lastEvent: "2020-05-20",
    repeatAfter: { unit: "hours", amount: 4 },
    constraints: [{ type: "weekdays", values: [1, 2, 4, 5] }],
  },
  {
    name: "Brian",
    lastEvent: "2020-05-29 11:00",
    repeatAfter: { unit: "hours", amount: 5 },
    eventLength: { unit: "minutes", amount: 60 },
    constraints: [{ type: "period", unit: "hours", min: 8, max: 12 }],
  },
];

const events = planEvents(clients);

const mappedEvents = events.map((event) => ({
  name: event.name,
  startDate: moment(event.start).format("YYYY/MM/DD"),
  startTime: moment(event.start).format("h:mm:ss a"),
  endDate: moment(event.end).format("YYYY/MM/DD"),
  endTime: moment(event.end).format("h:mm:ss a"),
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

csvWriter.writeRecords(mappedEvents);
