import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

export const generatePDF = (bookings, departments, date) => {
    const doc = new jsPDF()

    doc.setFontSize(18)
    doc.text('График распределения автотранспорта', 14, 22)

    doc.setFontSize(12)
    doc.text(`Дата: ${date}`, 14, 32)

    const totalBookings = bookings.length
    doc.text(`Всего бронирований: ${totalBookings}`, 14, 42)

    const bookingsByDepartment = bookings.reduce((acc, booking) => {
        const dept = booking.department_id
        if (!acc[dept]) acc[dept] = []
        acc[dept].push(booking)
        return acc
    }, {})

    let yOffset = 52

    Object.entries(bookingsByDepartment).forEach(([deptId, deptBookings]) => {
        const department = departments.find(d => d.id === deptId)

        doc.setFontSize(14)
        doc.text(department?.name || 'Неизвестная служба', 14, yOffset)
        doc.setFontSize(10)
        doc.text(`Начальник: ${department?.head_name || 'Не указан'}`, 14, yOffset + 6)

        const tableData = deptBookings.map(booking => {
            const timeSlot = booking.time_slot_label || booking.time_slot_id
            return [
                booking.vehicle?.vehicle_brand || '-',
                booking.vehicle?.state_number || '-',
                `Таб. №${booking.vehicle?.driver_full_name || '-'}`,
                timeSlot,
                booking.purpose || '-',
            ]
        })

        autoTable(doc, {
            startY: yOffset + 10,
            head: [['Модель', 'Госномер', 'Водитель', 'Время', 'Цель']],
            body: tableData,
            theme: 'striped',
            headStyles: { fillColor: [24, 144, 255] },
        })

        yOffset = doc.lastAutoTable.finalY + 20
    })

    const pageHeight = doc.internal.pageSize.height
    if (yOffset < pageHeight - 40) {
        doc.text('Начальник транспортного цеха: _______________', 14, pageHeight - 20)
        doc.text('М.П.', 14, pageHeight - 10)
    }

    doc.save(`График_распределения_ТС_${date}.pdf`)
}