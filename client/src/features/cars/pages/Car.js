import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Table, OverlayTrigger, Tooltip } from 'react-bootstrap';
import './Car.css';
import CarModel from './CarModel';

const getDatesArray = (startDate, endDate) => {
    const dates = [];
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
        dates.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates;
};

const TableCell = React.memo(({ car, date, carIndex, dateIndex }) => {
    const [showTooltip, setShowTooltip] = useState(false);
    const timerRef = React.useRef(null);

    const handleMouseEnter = useCallback(() => {
        timerRef.current = setTimeout(() => {
            setShowTooltip(true);
        }, 1000);
    }, []);

    const handleMouseLeave = useCallback(() => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }
        setShowTooltip(false);
    }, []);

    // Проверка, является ли дата текущей
    const isToday = date.toDateString() === new Date().toDateString();

    return (
        <OverlayTrigger
            placement="top"
            show={showTooltip}
            overlay={
                <Tooltip id={`tooltip-${carIndex}-${dateIndex}`}>
                    Это ячейка модели {car.model} на дату {date.toLocaleDateString()}
                </Tooltip>
            }
        >
            <td
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                style={{
                    backgroundColor: isToday ? 'lightgreen' : 'transparent', // Измените цвет на желаемый
                }}
            >
                {345}
            </td>
        </OverlayTrigger>
    );
});

const Car = () => {
    const [today] = useState(new Date());
    const [dates, setDates] = useState([]);

    useEffect(() => {
        const startDate = new Date(today);
        startDate.setDate(today.getDate() - 7);
        const endDate = new Date(today);
        endDate.setDate(today.getDate() + 7);

        setDates(getDatesArray(startDate, endDate));
    }, [today]);

    const tableHeader = useMemo(() => (
        <tr className="table-tr">
            <th style={{ width: '300px' }}>Модель</th>
            {dates.map((date, index) => {
                const isWeekend = date.getDay() === 0 || date.getDay() === 6;
                const isToday = date.toDateString() === today.toDateString();
                return (
                    <th
                        key={index}
                        className={`${isWeekend ? 'weekend' : ''} ${isToday ? 'today' : ''}`}
                    >
                        <p>{date.getDate()}</p>
                        <p>{date.toLocaleString('ru', { weekday: 'short' })}</p>
                    </th>
                );
            })}
        </tr>
    ), [dates, today]);

    return (
        <Table bordered size="sm" className="table-fixed">
            <thead>{tableHeader}</thead>
            <tbody>
                {CarModel.map((car, carIndex) => (
                    <tr key={carIndex} style={{ height: '50px' }}>
                        <td>{car.model}</td>
                        {dates.map((date, dateIndex) => (
                            <TableCell
                                key={`${carIndex}-${dateIndex}`}
                                car={car}
                                date={date}
                                carIndex={carIndex}
                                dateIndex={dateIndex}
                            />
                        ))}
                    </tr>
                ))}
            </tbody>
        </Table>
    );
};

export default Car;