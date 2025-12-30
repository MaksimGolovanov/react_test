export const formatDate = (date) => {
    if (!date) return '-'
    const d = new Date(date)
    if (isNaN(d.getTime())) return '-'

    return d.toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    })
}

export const formatDateForInput = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return ''

    const year = date.getFullYear()
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const day = date.getDate().toString().padStart(2, '0')

    return `${year}-${month}-${day}`
}

export const getNextCheckDate = (dateString) => {
    if (!dateString) return null

    const date = new Date(dateString)
    if (isNaN(date.getTime())) return null

    date.setDate(date.getDate() + 730)

    // Обнуляем время для корректного сравнения
    date.setHours(0, 0, 0, 0)
    return date
}

export const getCellColorClass = (card, styles = {}) => {
    // Если карта не в работе, не подсвечиваем даты
    if (card.log && card.log.toLowerCase().trim() === 'нет') {
        return ''
    }

    const nextCheckDate = getNextCheckDate(card.data_prov)
    if (!nextCheckDate) return ''

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const nextCheckDateOnly = new Date(nextCheckDate)
    nextCheckDateOnly.setHours(0, 0, 0, 0)

    const warningDate = new Date(nextCheckDateOnly)
    warningDate.setDate(warningDate.getDate() - 30)

    if (nextCheckDateOnly < today) return styles.expiredCell || ''
    if (warningDate <= today) return styles.warningCell || ''

    return ''
}

export const getRowColorClass = (card) => {
    // Если карта не в работе - желтая строка
    if (card.log && card.log.toLowerCase().trim() === 'нет') {
        return 'table-warning'
    }
    return ''
}