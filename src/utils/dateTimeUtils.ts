
export function toShortTimeStr(time: Date): string {
	return time.toLocaleTimeString(undefined, {hour: 'numeric', minute: 'numeric'});
}