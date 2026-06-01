import React, { useState, useEffect, useRef } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import PrintsService from '../services/PrintsService';
import moment from 'moment';
import { Row, Col } from 'antd';

Chart.register(...registerables);
Chart.register(ChartDataLabels);

const PrintChart = ({ itemid }) => {
  const [allData, setAllData] = useState([]);
  const [monthLabels, setMonthLabels] = useState([]);
  const [totalCopies, setTotalCopies] = useState(0);
  const [sliderPosition, setSliderPosition] = useState(0);
  const [maxSliderPosition, setMaxSliderPosition] = useState(0);
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const chartRef = useRef(null);

  // Определяем текущую тему
  useEffect(() => {
    const checkTheme = () => {
      setIsDarkTheme(document.body.classList.contains('dark-theme'));
    };
    checkTheme();
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  // Генерация всех меток месяцев
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

  // Получение цветов в зависимости от темы
  const getChartColors = () => ({
    textColor: isDarkTheme ? '#e0e0e0' : '#333',
    gridColor: isDarkTheme ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
    barBackground: isDarkTheme ? 'rgba(24, 144, 255, 0.7)' : 'rgba(75, 192, 192, 0.6)',
    barBorder: isDarkTheme ? 'rgba(24, 144, 255, 1)' : 'rgba(75, 192, 192, 1)',
    datalabelColor: isDarkTheme ? '#f0f0f0' : '#000',
    tooltipBackground: isDarkTheme ? 'rgba(0,0,0,0.85)' : 'rgba(255,255,255,0.9)',
    tooltipTextColor: isDarkTheme ? '#fff' : '#333',
  });

  // Обновление данных графика
  useEffect(() => {
    if (allData.length === 0) return;
    const allLabels = generateAllMonthLabels();
    const startIndex = Math.max(0, allLabels.length - 12 - sliderPosition);
    const endIndex = startIndex + 11;
    const visibleLabels = allLabels.slice(startIndex, endIndex + 1);
    setMonthLabels(visibleLabels);

    const monthlyData = {};
    allData.forEach(item => {
      const date = moment(item.clock * 1000);
      const monthKey = date.format('MMM YYYY');
      if (!monthlyData[monthKey]) monthlyData[monthKey] = [];
      monthlyData[monthKey].push({ date, value: item.value });
    });

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
  }, [sliderPosition, allData]);

  // Загрузка данных
  useEffect(() => {
    async function fetchData() {
      try {
        const data = await PrintsService.fetchPrintStatistic(itemid);
        if (data && Array.isArray(data)) {
          setAllData(data);
          const allLabels = generateAllMonthLabels();
          setMaxSliderPosition(Math.max(0, allLabels.length - 12));
          setSliderPosition(0);
        }
      } catch (error) {
        console.error('Ошибка при получении данных:', error);
      }
    }
    if (itemid) fetchData();
  }, [itemid]);

  // Подготовка данных для графика с учётом текущей темы
  const chartData = {
    labels: monthLabels,
    datasets: [
      {
        label: 'Количество копий в месяц',
        data: (() => {
          if (!allData.length) return [];
          const allLabels = generateAllMonthLabels();
          const startIndex = Math.max(0, allLabels.length - 12 - sliderPosition);
          const endIndex = startIndex + 11;
          const visibleLabels = allLabels.slice(startIndex, endIndex + 1);
          const monthlyData = {};
          allData.forEach(item => {
            const date = moment(item.clock * 1000);
            const monthKey = date.format('MMM YYYY');
            if (!monthlyData[monthKey]) monthlyData[monthKey] = [];
            monthlyData[monthKey].push({ date, value: item.value });
          });
          return visibleLabels.map(label => {
            const monthValues = monthlyData[label] || [];
            if (monthValues.length > 1) {
              monthValues.sort((a, b) => a.date - b.date);
              return monthValues[monthValues.length - 1].value - monthValues[0].value;
            }
            return 0;
          });
        })(),
        backgroundColor: getChartColors().barBackground,
        borderColor: getChartColors().barBorder,
        borderWidth: 1,
        datalabels: {
          display: true,
          color: getChartColors().datalabelColor,
          align: 'end',
          anchor: 'start',
          formatter: (value) => value,
          font: { weight: 'bold', size: 11 },
        },
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: getChartColors().textColor, font: { size: 12 } },
      },
      tooltip: {
        backgroundColor: getChartColors().tooltipBackground,
        titleColor: getChartColors().tooltipTextColor,
        bodyColor: getChartColors().tooltipTextColor,
        callbacks: {
          title: ([context]) => chartData.labels[context.dataIndex],
        },
      },
      datalabels: {
        display: true,
        color: getChartColors().datalabelColor,
        align: 'end',
        anchor: 'start',
        formatter: (value) => value,
        font: { weight: 'bold', size: 11 },
      },
    },
    scales: {
      x: {
        title: { display: true, text: 'Месяц', color: getChartColors().textColor },
        ticks: { color: getChartColors().textColor },
        grid: { color: getChartColors().gridColor },
      },
      y: {
        title: { display: true, text: 'Количество копий', color: getChartColors().textColor },
        ticks: { color: getChartColors().textColor },
        grid: { color: getChartColors().gridColor },
        beginAtZero: true,
      },
    },
  };

  const handleSliderChange = (e) => {
    setSliderPosition(parseInt(e.target.value));
  };

  if (!allData.length) {
    return <div style={{ textAlign: 'center', padding: 20, color: isDarkTheme ? '#ccc' : '#666' }}>Нет данных для графика</div>;
  }

  return (
    <div className="container-fluid p-3" style={{ maxWidth: '900px' }}>
      <Row className="mb-3">
        <Col>
          <div style={{ color: isDarkTheme ? '#e0e0e0' : '#333' }}>
            Общее количество копий за выбранный период: <strong>{totalCopies}</strong>
          </div>
        </Col>
      </Row>

      <div style={{ height: '300px' }}>
        <Bar data={chartData} options={chartOptions} ref={chartRef} />
      </div>
    </div>
  );
};

export default PrintChart;