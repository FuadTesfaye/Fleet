/**
 * Simulated API Client
 * 
 * This adds an artificial network delay to simulate a real backend.
 * We can wrap our existing Zustand store accesses with this to
 * make them behave like asynchronous API endpoints.
 */

const ARTIFICIAL_DELAY_MS = 300; // Adjust as needed

export async function simulatedFetch<T>(
  dataCallback: () => T | Promise<T>,
  delay: number = ARTIFICIAL_DELAY_MS
): Promise<T> {
  return new Promise((resolve, reject) => {
    setTimeout(async () => {
      try {
        const result = await dataCallback();
        resolve(result);
      } catch (error) {
        reject(error);
      }
    }, delay);
  });
}
