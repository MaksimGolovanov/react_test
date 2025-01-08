import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js'; // Импортируем Chart и registerables
import ChartDataLabels from 'chartjs-plugin-datalabels';
import PrintsService from './PrintsService';
import moment from 'moment';

// Массив с названиями месяцев на русском языке
const RUSSIAN_MONTHS = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'];
// Регистрация всех стандартных компонентов Chart.js
Chart.register(...registerables);
Chart.register(ChartDataLabels);

const PrintChart = (itemid) => {
    const [chartData, setChartData] = useState({
        labels: RUSSIAN_MONTHS,
        datasets: [
            {
                label: 'Количество копий в месяц',
                data: new Array(12).fill(0),
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
                datalabels: {
                    display: true,
                    color: '#000',
                    align: 'end',
                    anchor: 'start'
                }
            },
        ]
    });

    const [totalCopies, setTotalCopies] = useState(0);
    useEffect(() => {
        async function fetchData() {
            
            
            try {
                const data = await PrintsService.fetchPrintStatistic(itemid.itemid);

                if (data && Array.isArray(data)) {
                    const monthlyDifferences = [];
                    let firstValueOfCurrentMonth = null;
                    let lastValueOfPreviousMonth = null;
                    let currentMonth = null;

                    for (let i = 0; i < data.length; i++) {
                        const date = moment(data[i].clock * 1000); // Преобразуем timestamp в миллисекунды
                        const value = data[i].value;

                        if (currentMonth === null || date.month() !== currentMonth) {
                            if (firstValueOfCurrentMonth !== null) {
                                // Сохраняем разницу между последним значением предыдущего месяца и первым значением текущего месяца
                                monthlyDifferences.push(lastValueOfPreviousMonth - firstValueOfCurrentMonth);
                            }

                            currentMonth = date.month(); // Обновляем текущий месяц
                            firstValueOfCurrentMonth = value; // Устанавливаем новое первое значение для текущего месяца
                        }

                        lastValueOfPreviousMonth = value; // Обновляем последнее значение для предыдущего месяца
                    }

                    // Добавляем последнюю разницу, если есть данные
                    if (firstValueOfCurrentMonth !== null) {
                        monthlyDifferences.push(lastValueOfPreviousMonth - firstValueOfCurrentMonth);
                    }

                    const total = monthlyDifferences.reduce((acc, val) => acc + val, 0);
                    setTotalCopies(total);

                    const months = RUSSIAN_MONTHS.slice(0, monthlyDifferences.length);
                    setChartData(prevState => ({
                        ...prevState,
                        datasets: [{
                            ...prevState.datasets[0],
                            data: monthlyDifferences
                        }]
                    }));
                }
            } catch (error) {
                console.error('Ошибка при получении данных:', error);
            }
        }

        fetchData();
    }, [itemid]);

    return (
        <div style={{ maxWidth: '900px', height: '300px', marginTop:'50px' }}>
            <div style={{ textAlign: 'left', fontSize: '11px'}}>
                Общее количество копий за год: {totalCopies}
            </div>
            {chartData.labels && chartData.datasets ? (
                <Bar data={chartData} options={{
                    plugins: {
                        datalabels: {
                            formatter: (value) => `${value}`,
                        }
                    },
                    maintainAspectRatio: false
                }} />
            ) : (
                <p>Загрузка...</p>
            )}
        </div>
    );
};

export default PrintChart;