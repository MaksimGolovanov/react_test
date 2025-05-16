import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import PrintsService from '../services/PrintsService';
import moment from 'moment';
import {  Row, Col } from 'react-bootstrap';

Chart.register(...registerables);
Chart.register(ChartDataLabels);

const PrintChart = ({ itemid }) => {
    const [allData, setAllData] = useState([]);
    const [monthLabels, setMonthLabels] = useState([]);
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [{
            label: 'Количество копий в месяц',
            data: [],
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
            datalabels: {
                display: true,
                color: '#000',
                align: 'end',
                anchor: 'start'
            }
        }]
    });
    const [totalCopies, setTotalCopies] = useState(0);
    const [sliderPosition, setSliderPosition] = useState(0);
    const [maxSliderPosition, setMaxSliderPosition] = useState(0);

    // Генерация всех меток месяцев на основе данных
    const generateAllMonthLabels = () => {
        if (!allData || allData.length === 0) return [];
        
        const timestamps = allData.map(item => item.clock * 1000);
        const minDate = moment(Math.min(...timestamps));
        const maxDate = moment(Math.max(...timestamps));
        
        const months = [];
        let currentDate = moment(minDate).startOf('month');
        
        while (currentDate <= maxDate) {
            months.push(currentDate.format('MMM YYYY'));
            currentDate.add(1, 'month');
        }
        
        return months;
    };

    // Обновление данных графика при изменении позиции слайдера
    useEffect(() => {
        if (allData.length === 0) return;
        
        const allLabels = generateAllMonthLabels();
        const startIndex = Math.max(0, allLabels.length - 12 - sliderPosition);
        const endIndex = startIndex + 11;
        
        const visibleLabels = allLabels.slice(startIndex, endIndex + 1);
        setMonthLabels(visibleLabels);
        
        // Группировка данных по месяцам
        const monthlyData = {};
        allData.forEach(item => {
            const date = moment(item.clock * 1000);
            const monthKey = date.format('MMM YYYY');
            
            if (!monthlyData[monthKey]) {
                monthlyData[monthKey] = [];
            }
            
            monthlyData[monthKey].push({
                date: date,
                value: item.value
            });
        });

        // Вычисление разницы для каждого месяца
        const monthlyDifferences = visibleLabels.map(label => {
            const monthValues = monthlyData[label] || [];
            if (monthValues.length > 1) {
                monthValues.sort((a, b) => a.date - b.date);
                return monthValues[monthValues.length - 1].value - monthValues[0].value;
            }
            return 0;
        });

        const total = monthlyDifferences.reduce((acc, val) => acc + val, 0);
        setTotalCopies(total);

        setChartData({
            labels: visibleLabels,
            datasets: [{
                ...chartData.datasets[0],
                data: monthlyDifferences
            }]
        });
    }, [sliderPosition, allData]);

    // Загрузка данных
    useEffect(() => {
        async function fetchData() {
            try {
                const data = await PrintsService.fetchPrintStatistic(itemid);
                if (data && Array.isArray(data)) {
                    setAllData(data);
                    
                    const allLabels = generateAllMonthLabels();
                    const newMaxPosition = Math.max(0, allLabels.length - 12);
                    setMaxSliderPosition(newMaxPosition);
                    setSliderPosition(0); // Начинаем с самых последних данных
                }
            } catch (error) {
                console.error('Ошибка при получении данных:', error);
            }
        }

        if (itemid) fetchData();
    }, [itemid]);

    const handleSliderChange = (e) => {
        setSliderPosition(parseInt(e.target.value));
    };

    const allLabels = generateAllMonthLabels();
    const currentStartIndex = Math.max(0, allLabels.length - 12 - sliderPosition);
    const currentEndIndex = currentStartIndex + 11;

    return (
        <div className="container-fluid p-3" style={{ maxWidth: '900px' }}>
            <Row className="mb-3">
                <Col>
                    <div className="text-start small">
                        Общее количество копий за выбранный период: <strong>{totalCopies}</strong>
                    </div>
                </Col>
            </Row>



            <div style={{ height: '300px' }}>
                {chartData.labels && chartData.datasets ? (
                    <Bar 
                        data={chartData} 
                        options={{
                            plugins: {
                                datalabels: {
                                    formatter: (value) => `${value}`,
                                },
                                tooltip: {
                                    callbacks: {
                                        title: ([context]) => chartData.labels[context.dataIndex]
                                    }
                                }
                            },
                            maintainAspectRatio: false,
                            scales: {
                                x: {
                                    title: { display: true, text: 'Месяц' }
                                },
                                y: {
                                    title: { display: true, text: 'Количество копий' },
                                    beginAtZero: true
                                }
                            }
                        }} 
                    />
                ) : (
                    <p className="text-center mt-5">Загрузка данных...</p>
                )}
            </div>
        </div>
    );
};

export default PrintChart;