import { useState, useCallback } from 'react'
import { setVerbose as setConstantVerbose } from '../constants'

/**
 * Custom hook to manage verbose logging state
 * Updates both local React state and global constant
 * 
 * @param initialValue - Initial verbose state (defaults to true)
 * @returns [isVerbose, setVerbose] - Current state and setter function
 * 
 * Example:
 * const [isVerbose, setVerbose] = useVerbose(true)
 * setVerbose(false) // Updates both React state and global constant
 */
export function useVerbose(initialValue: boolean = true) {
    const [isVerbose, setIsVerbose] = useState(initialValue)
    
    const setVerbose = useCallback((value: boolean) => {
        // Always log state changes, regardless of verbose setting
        console.log('Console logging:', value ? 'enabled' : 'disabled')
        
        setIsVerbose(value)
        setConstantVerbose(value)
        return value
    }, [])
    
    return [isVerbose, setVerbose] as const
} 