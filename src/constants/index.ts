/**
 * Global tolerance value for position comparisons (in milliseconds)
 * Used across the application for determining if two positions should be considered equal
 */
export const TOLERANCE = 0.005 // 5ms tolerance 

export const ignoreMute = true // exclude muted clips from change detection

export let verbose = true // control console logging throughout the app
export const setVerbose = (value: boolean) => {
    verbose = value
}