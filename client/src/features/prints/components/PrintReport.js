// src/features/prints/components/PrintReport.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Card, Select, Button, Spin, Alert, Row, Col, Typography, theme } from 'antd';
import { Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import PrintsService from '../services/PrintsService';
import moment from 'moment';
import 'moment/locale/ru';

Chart.register(...registerables, ChartDataLabels);
moment.locale('ru');
const { Option } = Select;
const { Title, Text } = Typography;
const { useToken } = theme;

const PrintReport = () => {
  const { token } = useToken();
  const [printers, setPrinters] = useState([]);
  const [printModels, setPrintModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('year');
  const [selectedDate, setSelectedDate] = useState(moment().format('YYYY'));
  const [sortDirection, setSortDirection] = useState('desc');
  const [printerStats, setPrinterStats] = useState([]);
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [printersData, modelsData] = await Promise.all([PrintsService.fetchPrints(), PrintsService.fetchPrintModel()]);
        setPrinters(printersData);
        setPrintModels(modelsData);
      } catch (err) {
        setError('Ошибка загрузки данных');
      } finally { setLoading(false); }
    };
    fetchData();
  }, []);

  const getModelName = useCallback((modelId) => printModels.find(m => m.id === Number(modelId))?.name || 'Неизвестная модель', [printModels]);

  const processStats = useCallback(async () => {
    if (!printers.length) return;
    setLoading(true);
    setError(null);
    try {
      const statsPromises = printers.map(p => p.serial_number ? PrintsService.fetchPrintStatistic(p.serial_number).catch(() => []) : Promise.resolve([]));
      const allStats = await Promise.all(statsPromises);
      const date = timeRange === 'year' ? moment(selectedDate, 'YYYY') : moment(selectedDate, 'YYYY-MM');
      const start = date.clone().startOf(timeRange === 'year' ? 'year' : 'month');
      const end = date.clone().endOf(timeRange === 'year' ? 'year' : 'month');

      const stats = printers.map((printer, idx) => {
        const printerStats = allStats[idx] || [];
        let copies = 0;
        if (printerStats.length >= 2) {
          const periodData = printerStats.map(s => ({ ...s, date: moment(s.clock * 1000) }))
                                         .filter(s => s.date.isBetween(start, end, null, '[]'))
                                         .sort((a,b) => a.date - b.date);
          if (periodData.length >= 2) copies = periodData[periodData.length-1].value - periodData[0].value;
        }
        const model = getModelName(printer.print_model);
        const department = printer.department ? ` (${printer.department})` : '';
        const desc = printer.description ? ` — ${printer.description}` : '';
        return { id: printer.id, name: `${model}${department}${desc}`, copies: Math.max(0, copies) };
      });
      setPrinterStats(stats);
      updateChartData(stats, sortDirection);
    } catch (err) {
      setError('Ошибка при загрузке статистики');
    } finally { setLoading(false); }
  }, [printers, selectedDate, timeRange, sortDirection, getModelName]);

  useEffect(() => { processStats(); }, [processStats]);

  const updateChartData = (stats, direction) => {
    const sorted = [...stats].sort((a,b) => direction === 'desc' ? b.copies - a.copies : a.copies - b.copies);
    const labels = sorted.map(s => s.name);
    const data = sorted.map(s => s.copies);
    const backgroundColors = data.map((_,i) => `hsla(${(i * 360) / stats.length}, 70%, 55%, 0.7)`);
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
  };

  const handleTimeRangeChange = (val) => {
    setTimeRange(val);
    setSelectedDate(val === 'year' ? moment().format('YYYY') : moment().format('YYYY-MM'));
  };

  const dateOptions = () => {
    const current = moment();
    const start = moment('2024-01-01');
    const options = [];
    if (timeRange === 'year') {
      for (let y = start.year(); y <= current.year(); y++) options.push(<Option key={y} value={String(y)}>{y}</Option>);
    } else {
      for (let m = start.clone(); m.isBefore(current); m.add(1, 'month')) {
        options.push(<Option key={m.format('YYYY-MM')} value={m.format('YYYY-MM')}>{m.format('MMMM YYYY')}</Option>);
      }
    }
    return options;
  };

  const chartColors = {
    textColor: token.colorText,
    gridColor: token.colorBorder,
    tooltipBackground: token.colorBgElevated,
    tooltipTextColor: token.colorText,
    datalabelColor: token.colorText,
  };

  const chartOptions = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      datalabels: { display: true, color: chartColors.datalabelColor, anchor: 'end', align: 'right', formatter: (v) => v.toLocaleString(), font: { weight: 'bold', size: 11 } },
      tooltip: { backgroundColor: chartColors.tooltipBackground, titleColor: chartColors.tooltipTextColor, bodyColor: chartColors.tooltipTextColor, callbacks: { label: (ctx) => `${ctx.dataset.label}: ${ctx.raw.toLocaleString()}` } }
    },
    scales: {
      x: { title: { display: true, text: 'Количество копий', color: chartColors.textColor }, ticks: { color: chartColors.textColor, callback: (v) => v.toLocaleString() }, grid: { color: chartColors.gridColor }, beginAtZero: true },
      y: { title: { display: true, text: 'Принтеры', color: chartColors.textColor }, ticks: { color: chartColors.textColor }, grid: { display: false } }
    }
  };

  return (
    <div >
      {error && <Alert message="Ошибка" description={error} type="error" showIcon closable  />}
      <div style={{ marginBottom: 24 }}>
        <Row gutter={16} align="middle">
          <Col><Select value={timeRange} onChange={handleTimeRangeChange} style={{ width: 120 }}><Option value="year">Год</Option><Option value="month">Месяц</Option></Select></Col>
          <Col><Select value={selectedDate} onChange={setSelectedDate} style={{ width: 160 }}>{dateOptions()}</Select></Col>
          <Col><Button type={sortDirection === 'desc' ? 'primary' : 'default'} onClick={() => setSortDirection(prev => prev === 'desc' ? 'asc' : 'desc')}>По убыванию / возрастанию</Button></Col>
        </Row>
      </div>
      {loading ? (
        <div style={{ textAlign: 'center', padding: 50 }}><Spin size="large" /></div>
      ) : (
        <div style={{ maxHeight: 'calc(100vh - 270px)', overflowY: 'auto' }}>
          <div style={{ height: `${Math.max(printerStats.length * 40 + 100, 300)}px` }}>
            {chartData.labels?.length ? (
              <Bar data={chartData} options={chartOptions} />
            ) : (
              <Alert message="Нет данных для отображения" type="info" />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PrintReport;