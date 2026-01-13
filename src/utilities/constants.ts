import moment from "moment";

export const current_season = 23;
export const seasonDurationInWeeks = 16;
export const start = moment("06.10.25", "DD.MM.YYYY");
export const end = moment(start).add(seasonDurationInWeeks, "weeks");
export const duration = Math.abs(end.diff(start, "days"));
export const today = moment().startOf("day");
export const current_week = moment().startOf("isoWeek");
export const current_month = moment().startOf("month");

export const days_since_start = today.diff(start, "days");
export const version = { major: 2, minor: 0, patch: 3, full: "2.0.3" };

export const end_color = "rgb(29 91 131)";
export const start_color = "rgb(110 46 145)";
