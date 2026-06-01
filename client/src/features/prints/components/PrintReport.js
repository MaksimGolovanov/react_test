import React, { useState, useEffect, useCallback } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import PrintsService from '../services/PrintsService';
import moment from 'moment';
import 'moment/locale/ru';
import { Row, Col, Form, Card, Spinner, Container, Alert, Button } from 'react-bootstrap';

Chart.register(...registerables);
Chart.register(ChartDataLabels);

moment.locale('ru');

const PrintReport = () => {
    const [printers, setPrinters] = useState([]);
    const [printModels, setPrintModels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [timeRange, setTimeRange] = useState('year');
    const [selectedDate, setSelectedDate] = useState(moment().format('YYYY'));
    const [chartData, setChartData] = useState({ labels: [], datasets: [] });
    const [sortDirection, setSortDirection] = useState('desc');
    const [printerStats, setPrinterStats] = useState([]);
    const [isDarkTheme, setIsDarkTheme] = useState(false);

    // Определение текущей темы
    useEffect(() => {
        const checkTheme = () => {
            setIsDarkTheme(document.body.classList.contains('dark-theme'));
        };
        checkTheme();
        const observer = new MutationObserver(checkTheme);
        observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
        return () => observer.disconnect();
    }, []);

    // Функция получения цветов в зависимости от темы
    const getChartColors = useCallback(() => ({
        textColor: isDarkTheme ? '#e0e0e0' : '#333',
        gridColor: isDarkTheme ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
        tooltipBackground: isDarkTheme ? 'rgba(0,0,0,0.85)' : 'rgba(255,255,255,0.9)',
        tooltipTextColor: isDarkTheme ? '#fff' : '#333',
        datalabelColor: isDarkTheme ? '#f0f0f0' : '#000',
    }), [isDarkTheme]);

    // Загрузка списка принтеров и моделей
    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true);
                const [printersData, modelsData] = await Promise.all([
                    PrintsService.fetchPrints(),
                    PrintsService.fetchPrintModel()
                ]);
                if (!printersData || printersData.length === 0) {
                    setError('Нет данных о принтерах');
                    return;
                }
                setPrinters(printersData);
                setPrintModels(modelsData || []);
            } catch (error) {
                console.error('Ошибка при загрузке данных:', error);
                setError('Ошибка загрузки данных');
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    // Загрузка статистики при изменении параметров
    useEffect(() => {
        if (printers.length === 0) return;

        async function fetchStatistics() {
            setLoading(true);
            setError(null);
            try {
                const statsPromises = printers.map((printer) => {
                    if (!printer.serial_number) return Promise.resolve([]);
                    return PrintsService.fetchPrintStatistic(printer.serial_number).catch((err) => {
                        console.error(`Error fetching stats for printer ${printer.serial_number}:`, err);
                        return [];
                    });
                });
                const allStats = await Promise.all(statsPromises);
                processAndSaveStats(allStats);
            } catch (error) {
                console.error('Statistics fetch error:', error);
                setError('Ошибка при загрузке статистики');
            } finally {
                setLoading(false);
            }
        }

        fetchStatistics();
    }, [printers, timeRange, selectedDate]);

    const getModelNameById = useCallback((modelId) => {
        const model = printModels.find(m => m.id === Number(modelId));
        return model ? model.name : null;
    }, [printModels]);

    const processAndSaveStats = useCallback((allStats) => {
        const date = timeRange === 'year' ? moment(selectedDate, 'YYYY') : moment(selectedDate, 'YYYY-MM');
        const start = timeRange === 'year' ? date.clone().startOf('year') : date.clone().startOf('month');
        const end = timeRange === 'year' ? date.clone().endOf('year') : date.clone().endOf('month');

        const stats = printers.map((printer, index) => {
            const printerStats = allStats[index] || [];
            let copies = 0;
            if (printerStats.length > 0) {
                const periodData = printerStats
                    .map((item) => ({ ...item, date: moment(item.clock * 1000) }))
                    .filter((item) => item.date.isBetween(start, end, null, '[]'))
                    .sort((a, b) => a.date - b.date);
                if (periodData.length >= 2) {
                    copies = periodData[periodData.length - 1].value - periodData[0].value;
                }
            }
            const modelName = getModelNameById(printer.print_model) || 'Неизвестная модель';
            const department = printer.department ? ` (${printer.department})` : '';
            const description = printer.description ? ` — ${printer.description}` : '';
            const fullName = `${modelName}${department}${description}`;
            return { id: printer.id, name: fullName, copies: Math.max(0, copies), printerData: printer };
        });

        setPrinterStats(stats);
        updateChartData(stats, sortDirection);
    }, [printers, selectedDate, timeRange, sortDirection, getModelNameById]);

    const updateChartData = useCallback((stats, direction) => {
        const sortedStats = [...stats].sort((a, b) => direction === 'desc' ? b.copies - a.copies : a.copies - b.copies);
        const labels = sortedStats.map(item => item.name);
        const data = sortedStats.map(item => item.copies);
        const backgroundColors = data.map((_, i) => {
            const hue = (i * 360) / stats.length;
            return isDarkTheme ? `hsla(${hue}, 70%, 55%, 0.7)` : `hsla(${hue}, 70%, 60%, 0.7)`;
        });

        setChartData({
            labels,
            datasets: [{
                label: `Количество копий за ${timeRange === 'year' ? 'год' : 'месяц'}`,
                data,
                backgroundColor: backgroundColors,
                borderColor: backgroundColors.map(c => c.replace('0.7', '1')),
                borderWidth: 1,
                borderRadius: 4,
                barThickness: 20,
            }]
        });
    }, [timeRange, isDarkTheme]);

    const toggleSortDirection = useCallback(() => {
        const newDirection = sortDirection === 'desc' ? 'asc' : 'desc';
        setSortDirection(newDirection);
        updateChartData(printerStats, newDirection);
    }, [printerStats, sortDirection, updateChartData]);

    const handleTimeRangeChange = (e) => {
        setTimeRange(e.target.value);
        setSelectedDate(e.target.value === 'year' ? moment().format('YYYY') : moment().format('YYYY-MM'));
    };

    const handleDateChange = (e) => setSelectedDate(e.target.value);

    const generateDateOptions = () => {
        const options = [];
        const current = moment();
        const start = moment('2024-01-01');
        if (timeRange === 'year') {
            for (let year = start.year(); year <= current.year(); year++) {
                options.push(<option key={year} value={year}>{year}</option>);
            }
        } else {
            for (let m = moment(start); m.isBefore(current); m.add(1, 'month')) {
                options.push(<option key={m.format('YYYY-MM')} value={m.format('YYYY-MM')}>{m.format('MMMM YYYY')}</option>);
            }
        }
        return options;
    };

    const chartColors = getChartColors();

    const chartOptions = {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            datalabels: {
                display: true,
                color: chartColors.datalabelColor,
                anchor: 'end',
                align: 'right',
                formatter: (value) => value.toLocaleString(),
                font: { weight: 'bold', size: 11 },
            },
            tooltip: {
                backgroundColor: chartColors.tooltipBackground,
                titleColor: chartColors.tooltipTextColor,
                bodyColor: chartColors.tooltipTextColor,
                callbacks: {
                    label: (context) => `${context.dataset.label}: ${context.raw.toLocaleString()}`,
                },
            },
        },
        scales: {
            x: {
                title: { display: true, text: 'Количество копий', color: chartColors.textColor, font: { weight: 'bold', size: 14 } },
                ticks: { color: chartColors.textColor, callback: (value) => value.toLocaleString() },
                grid: { color: chartColors.gridColor },
                beginAtZero: true,
            },
            y: {
                title: { display: true, text: 'Принтеры', color: chartColors.textColor, font: { weight: 'bold', size: 14 } },
                ticks: { color: chartColors.textColor },
                grid: { display: false },
            },
        },
    };

    return (
        <Container className="py-4">
            <h2 className="mb-4" style={{ color: isDarkTheme ? '#f0f0f0' : '#333' }}>Отчет по принтерам</h2>

            {error && (
                <Alert variant="danger" onClose={() => setError(null)} dismissible>
                    {error}
                </Alert>
            )}

            <Card className="mb-4">
                <Card.Body>
                    <Row className="g-3 align-items-center">
                        <Col md={3}>
                            <Form.Select value={timeRange} onChange={handleTimeRangeChange} disabled={loading}>
                                <option value="year">Год</option>
                                <option value="month">Месяц</option>
                            </Form.Select>
                        </Col>
                        <Col md={3}>
                            <Form.Select value={selectedDate} onChange={handleDateChange} disabled={loading}>
                                {generateDateOptions()}
                            </Form.Select>
                        </Col>
                        <Col md={3}>
                            <Button
                                variant={sortDirection === 'desc' ? 'primary' : 'outline-primary'}
                                onClick={toggleSortDirection}
                                disabled={loading || printerStats.length === 0}
                                style={{ height: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            >
                                {sortDirection === 'desc' ? 'По убыванию ▼' : 'По возрастанию ▲'}
                            </Button>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            {loading ? (
                <div className="text-center py-5">
                    <Spinner animation="border" variant="primary" />
                    <p className="mt-2" style={{ color: isDarkTheme ? '#ccc' : '#666' }}>Загрузка данных...</p>
                </div>
            ) : (
                <Card>
                    <Card.Body>
                        <div style={{ height: `${Math.max(printerStats.length * 40 + 100, 300)}px`, minHeight: '300px' }}>
                            {chartData.labels?.length > 0 ? (
                                <Bar data={chartData} options={chartOptions} />
                            ) : (
                                <Alert variant="info" className="text-center">Нет данных для отображения</Alert>
                            )}
                        </div>
                    </Card.Body>
                </Card>
            )}
        </Container>
    );
};

export default PrintReport;