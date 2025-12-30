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

export const getNextCheckDate = (dateString) => {
    if (!dateString) return null
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return null
    date.setDate(date.getDate() + 90)
    return date
}