
export function arrayEquals<T>(a1: T[], a2: T[]): boolean {
	
	if (a1.length !== a2.length)
		return false
	
	const s2 = new Set(a2)

    for (var a of a1) {
		if (!s2.has(a))
			return false
	}
	
    return true
}