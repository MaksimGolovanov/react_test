import React, { useState, useEffect, useRef } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { theme, Typography } from 'antd';
import PrintsService from '../services/PrintsService';
import moment from 'moment';

Chart.register(...registerables, ChartDataLabels);
const { useToken } = theme;
const { Text } = Typography;

const PrintChart = ({ serialNumber }) => {
  const { token } = useToken();
  const [allData, setAllData] = useState([]);
  const [monthLabels, setMonthLabels] = useState([]);
  const [totalCopies, setTotalCopies] = useState(0);
  const [lastValue, setLastValue] = useState(0);
  const [sliderPosition, setSliderPosition] = useState(0);
  const [maxSliderPosition, setMaxSliderPosition] = useState(0);
  const chartRef = useRef(null);

  const generateAllMonthLabels = () => {
    if (!allData.length) return [];
    const timestamps = allData.map(item => item.clock * 1000);
    const minDate = moment(Math.min(...timestamps));
    const maxDate = moment(Math.max(...timestamps));
    const months = [];
    let current = moment(minDate).startOf('month');
    while (current <= maxDate) {
      months.push(current.format('MMM YYYY'));
      current.add(1, 'month');
    }
    return months;
  };

  const getChartColors = () => ({
    textColor: token.colorText,
    gridColor: token.colorBorder,
    barBackground: token.colorPrimaryBg,
    barBorder: token.colorPrimary,
    datalabelColor: token.colorText,
    tooltipBackground: token.colorBgElevated,
    tooltipTextColor: token.colorText,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await PrintsService.fetchPrintStatistic(serialNumber);
        if (data && Array.isArray(data) && data.length) {
          setAllData(data);
          // последнее значение
          const sorted = [...data].sort((a, b) => a.clock - b.clock);
          setLastValue(sorted[sorted.length - 1].value);
        }
      } catch (error) {
        console.error('Ошибка загрузки статистики:', error);
      }
    };
    if (serialNumber) fetchData();
  }, [serialNumber]);

  useEffect(() => {
    if (!allData.length) return;
    const allLabels = generateAllMonthLabels();
    setMaxSliderPosition(Math.max(0, allLabels.length - 12));
    const start = Math.max(0, allLabels.length - 12 - sliderPosition);
    const visible = allLabels.slice(start, start + 12);
    setMonthLabels(visible);

    const monthlyData = {};
    allData.forEach(item => {
      const date = moment(item.clock * 1000);
      const key = date.format('MMM YYYY');
      if (!monthlyData[key]) monthlyData[key] = [];
      monthlyData[key].push({ date, value: item.value });
    });

    const differences = visible.map(label => {
      const vals = monthlyData[label] || [];
      if (vals.length > 1) {
        vals.sort((a, b) => a.date - b.date);
        return vals[vals.length - 1].value - vals[0].value;
      }
      return 0;
    });
    const sum = differences.reduce((a, b) => a + b, 0);
    setTotalCopies(sum);
  }, [sliderPosition, allData]);

  const chartData = {
    labels: monthLabels,
    datasets: [{
      label: 'Количество копий в месяц',
      data: (() => {
        if (!allData.length) return [];
        const allLabels = generateAllMonthLabels();
        const start = Math.max(0, allLabels.length - 12 - sliderPosition);
        const visible = allLabels.slice(start, start + 12);
        const monthlyData = {};
        allData.forEach(item => {
          const date = moment(item.clock * 1000);
          const key = date.format('MMM YYYY');
          if (!monthlyData[key]) monthlyData[key] = [];
          monthlyData[key].push({ date, value: item.value });
        });
        return visible.map(label => {
          const vals = monthlyData[label] || [];
          if (vals.length > 1) {
            vals.sort((a, b) => a.date - b.date);
            return vals[vals.length - 1].value - vals[0].value;
          }
          return 0;
        });
      })(),
      backgroundColor: getChartColors().barBackground,
      borderColor: getChartColors().barBorder,
      borderWidth: 1,
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: getChartColors().textColor, font: { size: 12 } } },
      tooltip: {
        backgroundColor: getChartColors().tooltipBackground,
        titleColor: getChartColors().tooltipTextColor,
        bodyColor: getChartColors().tooltipTextColor,
      },
      datalabels: {
        display: true,
        color: getChartColors().datalabelColor,
        align: 'end',
        anchor: 'start',
        formatter: (value) => value,
        font: { weight: 'bold', size: 11 }
      }
    },
    scales: {
      x: { title: { display: true, text: 'Месяц', color: getChartColors().textColor }, ticks: { color: getChartColors().textColor }, grid: { color: getChartColors().gridColor } },
      y: { title: { display: true, text: 'Количество копий', color: getChartColors().textColor }, ticks: { color: getChartColors().textColor }, grid: { color: getChartColors().gridColor }, beginAtZero: true }
    }
  };

  if (!allData.length) return <div style={{ textAlign: 'center', padding: 20, color: token.colorTextSecondary }}>Нет данных для графика</div>;

  return (
    <div style={{ width: '100%', padding: 16 }}>
      <div style={{ marginBottom: 16, fontSize: 14, display: 'flex', gap: 24 }}>
        <span>Текущий пробег: <strong>{lastValue}</strong> копий</span>
        <span>За последние 12 месяцев: <strong>{totalCopies}</strong> копий</span>
      </div>
      <div style={{ height: 300 }}>
        <Bar data={chartData} options={chartOptions} ref={chartRef} />
      </div>
      {maxSliderPosition > 0 && (
        <input
          type="range"
          min="0"
          max={maxSliderPosition}
          value={sliderPosition}
          onChange={(e) => setSliderPosition(Number(e.target.value))}
          style={{ width: '100%', marginTop: 16 }}
        />
      )}
    </div>
  );
};

export default PrintChart;