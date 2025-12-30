import { useState, useMemo, useCallback } from 'react'

export const useUsbFilters = () => {
    const [searchTerm, setSearchTerm] = useState('')
    const [showInWorkOnly, setShowInWorkOnly] = useState(true)
    const [sortConfig, setSortConfig] = useState({
        key: 'num_form',
        direction: 'ascending',
    })

    const handleSort = useCallback((key) => {
        setSortConfig(prev => {
            let direction = 'ascending'
            if (prev.key === key && prev.direction === 'ascending') {
                direction = 'descending'
            }
            return { key, direction }
        })
    }, [])

    const toggleShowInWorkOnly = useCallback((e) => {
        setShowInWorkOnly(e.target.checked)
    }, [])

    return {
        searchTerm,
        setSearchTerm,
        showInWorkOnly,
        toggleShowInWorkOnly,
        sortConfig,
        handleSort,
    }
}