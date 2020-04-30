import moment, { Moment } from "moment";

const OneSecondValue = 1000;
const OneMinuteValue = 60 * OneSecondValue;
const OneHourValue = 60 * OneMinuteValue;
const OneDayValue = 24 * OneHourValue;

export function toShortTimeStr(time: Date | undefined | null): string | undefined | null {
	
	if(!time)
		return time;

	return time.toLocaleTimeString(undefined, { hour: 'numeric', minute: 'numeric' });
}

export function toShortDateAndTime(time: Date | undefined | null): string | undefined | null  {
	
	if(!time)
		return time;

	return time.toLocaleDateString(undefined, { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' });
}

export function getDate(source: Date) {
	return new Date(source.getFullYear(), source.getMonth(), source.getDate());
}

export function setDate(source: Date, date: Date | string) {

	let dateMoment = moment(date)
	let timeMoment = moment(source)

	return combineMoments(dateMoment, timeMoment).toDate()
}

export function setTime(source: Date, time: string | Date): Date {

	let dateMoment = moment(source)
	let timeMoment = moment(time, "HH:mm")

	return combineMoments(dateMoment, timeMoment).toDate()
}

function combineMoments(dateMoment: moment.Moment, timeMoment: moment.Moment): Moment {
	return dateMoment.set({ hour: timeMoment.hour(), minute: timeMoment.minute(), second: timeMoment.second() });
}

export function addDays(source: Date, days: number): Date {
	return new Date(source.valueOf() + days * OneDayValue);
}

export function addHours(source: Date, hours: number): Date {
	return new Date(source.valueOf() + hours * OneHourValue);
}

export function addMinutes(date: Date, minutes: number): Date {
	return new Date(date.valueOf() + minutes * OneMinuteValue);
}

export function getTimeValue(date: Date): number {
	return date.valueOf() - getDate(date).valueOf();
}

export function parseDate(str: string): Date | undefined {
	const value = Date.parse(str);
	return (isNaN(value) ? undefined : new Date(value));
}
