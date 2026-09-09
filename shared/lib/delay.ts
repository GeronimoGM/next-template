/**
 * Fakes delay for a given number of milliseconds. Only for testing purposes. DO NOT use in production.
 */
export async function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
