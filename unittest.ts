export function declareTest(name: string, fn: () => void): void {
    if (!process.env.RUN_TEST) {
        return
    }
    try {
        fn()
        console.log(`\x1b[42mPASSED\x1b[0m ${name}`)
    } catch (e) {
        console.error(`\x1b[41mFAILED\x1b[0m ${name}`, e)
        process.exit(1)
    }
}

export function assert(condition: boolean, message?: string): void {
    if (!condition) {
        throw new Error(message)
    }
}

export function assertEquals(actual: any, expected: any, message?: string): void {
    if (JSON.stringify(actual) !== JSON.stringify(expected)) {
        throw new Error(message || `Expected ${expected}, got ${actual}`)
    }
}
