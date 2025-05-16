import React, { useState, useEffect, useCallback } from 'react'
import { Bar } from 'react-chartjs-2'
import { Chart, registerables } from 'chart.js'
import ChartDataLabels from 'chartjs-plugin-datalabels'
import PrintsService from '../services/PrintsService'
import moment from 'moment'
import 'moment/locale/ru'
import { Row, Col, Form, Card, Spinner, Container, Alert, Button } from 'react-bootstrap'

Chart.register(...registerables)
Chart.register(ChartDataLabels)

moment.locale('ru')

const PrintReport = () => {
     const [printers, setPrinters] = useState([])
     const [loading, setLoading] = useState(true)
     const [error, setError] = useState(null)
     const [timeRange, setTimeRange] = useState('year')
     const [selectedDate, setSelectedDate] = useState(moment().format('YYYY-MM'))
     const [chartData, setChartData] = useState({
          labels: [],
          datasets: [
               {
                    label: 'Количество копий',
                    data: [],
                    backgroundColor: 'rgba(54, 162, 235, 0.7)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1,
                    borderRadius: 4,
                    barThickness: 20,
               },
          ],
     })
     const [sortDirection, setSortDirection] = useState('desc')
     const [printerStats, setPrinterStats] = useState([])

     // Загрузка списка принтеров
     useEffect(() => {
          async function fetchPrinters() {
               try {
                    setLoading(true)
                    const data = await PrintsService.fetchPrints()
                    if (!data || data.length === 0) {
                         setError('Нет данных о принтерах')
                         return
                    }
                    setPrinters(data)
               } catch (error) {
                    console.error('Ошибка при получении списка принтеров:', error)
                    setError('Ошибка загрузки списка принтеров')
               } finally {
                    setLoading(false)
               }
          }
          fetchPrinters()
     }, [])

     // Загрузка статистики при изменении параметров
     useEffect(() => {
          if (printers.length === 0) return

          async function fetchStatistics() {
               setLoading(true)
               setError(null)
               try {
                    const statsPromises = printers.map((printer) => {
                         if (!printer.serial_number) return Promise.resolve([])
                         return PrintsService.fetchPrintStatistic(printer.serial_number).catch((err) => {
                              console.error(`Error fetching stats for printer ${printer.serial_number}:`, err)
                              return []
                         })
                    })

                    const allStats = await Promise.all(statsPromises)
                    processAndSaveStats(allStats)
               } catch (error) {
                    console.error('Statistics fetch error:', error)
                    setError('Ошибка при загрузке статистики')
               } finally {
                    setLoading(false)
               }
          }

          fetchStatistics()
     }, [printers, timeRange, selectedDate])

     // Обработка и сохранение статистики
     const processAndSaveStats = useCallback(
          (allStats) => {
               const date = moment(selectedDate)
               const start = timeRange === 'year' ? date.clone().startOf('year') : date.clone().startOf('month')
               const end = timeRange === 'year' ? date.clone().endOf('year') : date.clone().endOf('month')

               const stats = printers.map((printer, index) => {
                    const printerStats = allStats[index] || []
                    let copies = 0

                    if (printerStats.length > 0) {
                         const periodData = printerStats
                              .map((item) => ({
                                   ...item,
                                   date: moment(item.clock * 1000),
                              }))
                              .filter((item) => item.date.isBetween(start, end, null, '[]'))
                              .sort((a, b) => a.date - b.date)

                         if (periodData.length >= 2) {
                              copies = periodData[periodData.length - 1].value - periodData[0].value
                         }
                    }

                    return {
                         id: printer.id,
                         name: printer.logical_name || `Принтер ${printer.serial_number}`,
                         copies: Math.max(0, copies),
                         printerData: printer,
                    }
               })

               setPrinterStats(stats)
               updateChartData(stats, sortDirection) // Явно передаем текущее направление сортировки
          },
          [printers, selectedDate, timeRange, sortDirection]
     )

     // Обновление данных графика
     const updateChartData = useCallback(
          (stats, direction) => {
               const sortedStats = [...stats].sort((a, b) => {
                    return direction === 'desc' ? b.copies - a.copies : a.copies - b.copies
               })

               const labels = sortedStats.map((item) => item.name)
               const data = sortedStats.map((item) => item.copies)
               const backgroundColors = data.map((_, i) => `hsl(${(i * 360) / printers.length}, 70%, 60%, 0.7)`)

               setChartData({
                    labels,
                    datasets: [
                         {
                              label: `Количество копий за ${timeRange === 'year' ? 'год' : 'месяц'}`,
                              data,
                              backgroundColor: backgroundColors,
                              borderColor: backgroundColors.map((color) => color.replace('0.7', '1')),
                              borderWidth: 1,
                              borderRadius: 4,
                              barThickness: 20,
                         },
                    ],
               })
          },
          [printers.length, timeRange]
     )

     // Обработчик изменения направления сортировки
     const toggleSortDirection = useCallback(() => {
          const newDirection = sortDirection === 'desc' ? 'asc' : 'desc'
          setSortDirection(newDirection)
          updateChartData(printerStats, newDirection) // Используем новое направление сразу
     }, [printerStats, sortDirection, updateChartData])

     const handleTimeRangeChange = (e) => {
          setTimeRange(e.target.value)
          setSelectedDate(moment().format('YYYY-MM'))
     }

     const handleDateChange = (e) => {
          setSelectedDate(e.target.value)
     }

     const generateDateOptions = () => {
          const options = []
          const current = moment()
          const start = moment('2024-01-01')

          if (timeRange === 'year') {
               for (let year = start.year(); year <= current.year(); year++) {
                    options.push(
                         <option key={year} value={`${year}-01`}>
                              {year}
                         </option>
                    )
               }
          } else {
               for (let m = moment(start); m.isBefore(current); m.add(1, 'month')) {
                    options.push(
                         <option key={m.format('YYYY-MM')} value={m.format('YYYY-MM')}>
                              {m.format('MMMM YYYY')}
                         </option>
                    )
               }
          }

          return options
     }

     return (
          <Container className="py-4">
               <h2 className="mb-4">Отчет по принтерам</h2>

               {error && (
                    <Alert variant="danger" onClose={() => setError(null)} dismissible>
                         {error}
                    </Alert>
               )}

               <Card className="mb-4">
                    <Card.Body>
                         <Row className="g-3 align-items-center">
                              {' '}
                              {/* Добавлен g-3 для отступов между колонками */}
                              <Col md={3}>
                                   <Form.Group className="h-100 d-flex flex-column">
                                        {' '}
                                        {/* Добавлены flex-стили */}
                                        
                                        <Form.Select
                                             value={timeRange}
                                             onChange={handleTimeRangeChange}
                                             disabled={loading}
                                             className="flex-grow-0" /* Запрещаем растягивание */
                                        >
                                             <option value="year">Год</option>
                                             <option value="month">Месяц</option>
                                        </Form.Select>
                                   </Form.Group>
                              </Col>
                              <Col md={3}>
                                   <Form.Group className="h-100 d-flex flex-column">
                                        
                                        <Form.Select
                                             value={selectedDate}
                                             onChange={handleDateChange}
                                             disabled={loading}
                                             className="flex-grow-0"
                                        >
                                             {generateDateOptions()}
                                        </Form.Select>
                                   </Form.Group>
                              </Col>
                              <Col md={3}>
                                   <div className="h-100 d-flex flex-column justify-content-end">
                                        {' '}
                                        {/* Контейнер для кнопки */}
                                        <Button
                                             variant={sortDirection === 'desc' ? 'primary' : 'outline-primary'}
                                             onClick={toggleSortDirection}
                                             disabled={loading || printerStats.length === 0}
                                             style={{
                                                  height: '38px' /* Фиксированная высота как у Form.Select */,
                                                  display: 'flex',
                                                  alignItems: 'center',
                                                  justifyContent: 'center',
                                             }}
                                        >
                                             {sortDirection === 'desc' ? 'По убыванию ▼' : 'По возрастанию ▲'}
                                        </Button>
                                   </div>
                              </Col>
                         </Row>
                    </Card.Body>
               </Card>

               {loading ? (
                    <div className="text-center py-5">
                         <Spinner animation="border" variant="primary" />
                         <p className="mt-2">Загрузка данных...</p>
                    </div>
               ) : (
                    <Card>
                         <Card.Body>
                              <div
                                   style={{
                                        height: `${Math.max(printers.length * 40 + 100, 300)}px`,
                                        minHeight: '300px',
                                   }}
                              >
                                   {chartData.labels.length > 0 ? (
                                        <Bar
                                             data={chartData}
                                             options={{
                                                  indexAxis: 'y',
                                                  responsive: true,
                                                  plugins: {
                                                       legend: {
                                                            display: false,
                                                       },
                                                       datalabels: {
                                                            display: true,
                                                            color: '#000',
                                                            anchor: 'end',
                                                            align: 'right',
                                                            formatter: (value) => value.toLocaleString(),
                                                            font: {
                                                                 weight: 'bold',
                                                            },
                                                       },
                                                       tooltip: {
                                                            callbacks: {
                                                                 label: (context) => {
                                                                      const label = context.dataset.label || ''
                                                                      return `${label}: ${context.raw.toLocaleString()}`
                                                                 },
                                                            },
                                                       },
                                                  },
                                                  maintainAspectRatio: false,
                                                  scales: {
                                                       x: {
                                                            title: {
                                                                 display: true,
                                                                 text: 'Количество копий',
                                                                 font: {
                                                                      weight: 'bold',
                                                                      size: 14,
                                                                 },
                                                            },
                                                            beginAtZero: true,
                                                            ticks: {
                                                                 callback: (value) => value.toLocaleString(),
                                                            },
                                                       },
                                                       y: {
                                                            title: {
                                                                 display: true,
                                                                 text: 'Принтеры',
                                                                 font: {
                                                                      weight: 'bold',
                                                                      size: 14,
                                                                 },
                                                            },
                                                            grid: {
                                                                 display: false,
                                                            },
                                                       },
                                                  },
                                             }}
                                        />
                                   ) : (
                                        <Alert variant="info" className="text-center">
                                             Нет данных для отображения
                                        </Alert>
                                   )}
                              </div>
                         </Card.Body>
                    </Card>
               )}
          </Container>
     )
}

export default PrintReport
