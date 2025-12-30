export const getCellColorClass = (usb, getNextCheckDate, styles) => {
    if (usb.log && usb.log.toLowerCase().trim() === 'нет') {
        return ''
    }

    const nextCheckDate = getNextCheckDate(usb.data_prov)
    if (!nextCheckDate) return ''

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const nextCheckDateOnly = new Date(nextCheckDate)
    nextCheckDateOnly.setHours(0, 0, 0, 0)

    const warningDate = new Date(nextCheckDateOnly)
    warningDate.setDate(warningDate.getDate() - 7)

    if (nextCheckDateOnly < today) return styles.expiredCell
    if (warningDate <= today) return styles.warningCell

    return ''
}

export const filterAndSortUsbs = (usbData, searchTerm, showInWorkOnly, sortConfig) => {
    const filtered = usbData?.filter(
        (usb) =>
            ((usb.num_form && usb.num_form.includes(searchTerm)) ||
                (usb.ser_num && usb.ser_num.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (usb.fio && usb.fio.toLowerCase().includes(searchTerm.toLowerCase()))) &&
            (!showInWorkOnly || (usb.log && usb.log.toLowerCase() === 'да'))
    ) || []

    if (!sortConfig.key) return filtered

    return [...filtered].sort((a, b) => {
        if (sortConfig.key === 'num_form') {
            const numA = parseInt(a.num_form) || 0
            const numB = parseInt(b.num_form) || 0
            return sortConfig.direction === 'ascending' ? numA - numB : numB - numA
        }

        if (sortConfig.key === 'volume') {
            const numA = parseFloat(a[sortConfig.key]) || 0
            const numB = parseFloat(b[sortConfig.key]) || 0
            return sortConfig.direction === 'ascending' ? numA - numB : numB - numA
        }

        if (sortConfig.key.includes('data')) {
            const dateA = new Date(a[sortConfig.key])
            const dateB = new Date(b[sortConfig.key])
            if (isNaN(dateA.getTime())) return sortConfig.direction === 'ascending' ? -1 : 1
            if (isNaN(dateB.getTime())) return sortConfig.direction === 'ascending' ? 1 : -1
            return sortConfig.direction === 'ascending' ? dateA - dateB : dateB - dateA
        }

        const valueA = a[sortConfig.key] ? a[sortConfig.key].toString().toLowerCase() : ''
        const valueB = b[sortConfig.key] ? b[sortConfig.key].toString().toLowerCase() : ''

        if (valueA < valueB) {
            return sortConfig.direction === 'ascending' ? -1 : 1
        }
        if (valueA > valueB) {
            return sortConfig.direction === 'ascending' ? 1 : -1
        }
        return 0
    })
}