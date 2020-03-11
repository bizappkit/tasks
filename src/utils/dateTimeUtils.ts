
const OneSecondValue = 1000;
const OneMinuteValue = 60 * OneSecondValue;
const OneHourValue = 60 * OneMinuteValue;
const OneDayValue = 24 * OneHourValue;

export function toShortTimeStr(time: Date): string {
	return time.toLocaleTimeString(undefined, { hour: 'numeric', minute: 'numeric' });
}

export function toShortDateAndTime(time: Date): string {
	return time.toLocaleDateString(undefined, { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' });
}

export function getDate(source: Date) {
	return new Date(source.getFullYear(), source.getMonth(), source.getDate());
}

export function setDate(source: Date, date: Date) {
	return new Date(
		date.getFullYear(), date.getMonth(), date.getDate(),
		source.getHours(), source.getMinutes(), source.getSeconds(), source.getMilliseconds()
	);
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

export function toYYYYMMDD(value?: Date): string | undefined {

	if (!value)
		return undefined;

	var mm = value.getMonth() + 1; // getMonth() is zero-based
	var dd = value.getDate();

	return `${value.getFullYear()}-${(mm > 9 ? '' : '0') + mm}-${(dd > 9 ? '' : '0') + dd}`;
}

export function toHHMM(value?: Date): string | undefined {

	if (!value)
		return undefined;

	var hh = value.getHours();
	var mm = value.getMinutes();

	return `${(hh > 9 ? '' : '0') + mm}:${(mm > 9 ? '' : '0') + mm}`;
}