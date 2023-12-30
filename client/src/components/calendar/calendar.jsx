import React, { useState, useEffect } from 'react';
import data from '../../personnelData.json'

import './calendar.css';

const Calendar = (props) => {
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [scheduledSlots, setScheduledSlots] = useState([]); // [ { day: 'Monday', start: 12, end: 13 }, ...    
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const hoursInDay = Array.from({ length: 24 }, (_, i) => i);

    const handleSlotClick = (day, hour) => {
        console.log(day, hour);
        setSelectedSlot({ day, hour });
        props.handleSelectedSlot({ day, hour });
    };

    useEffect(() => {
        let personID = props.personID;
        console.log(personID)
        if (personID === null) return;
        let person = data.personnel[personID];
        let bookings = person.bookings;

        let slots = [];

        for (let i = 0; i < bookings.length; i++) {
            const booking = bookings[i];
            let start = parseInt(booking.startTime);
            let end = parseInt(booking.endTime);
            let day = booking.day;
            slots.push({ day, start: start, end: end });
        }
        setScheduledSlots(slots);
       
    }, [props]);

    useEffect(() => {
        //event listener for click outside set selected slot to null
        const handleClickOutside = (e) => {
            if (!e.target.className.includes('cell')) {
                console.log(e.target.className);
                setSelectedSlot(null);
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };

    }, [selectedSlot]);


    const isSlotScheduled = (day, hour) => {
        return scheduledSlots.some(slot => {
            return slot.day === day && hour >= slot.start && hour < slot.end;
        });
    };

    const renderCalendar = () => {
        return (
            <div className='calendar'>
                <div className="header">
                    <div key={0} className="cell empty"></div>
                    {daysOfWeek.map(day => (
                        <div key={day} className="header-cell">{day}</div>
                    ))}
                </div>
                <div className="body">
                    {hoursInDay.map(hour => (
                        <div key={hour} className="row">
                            <div className={`cell hours`}>
                                {hour}:00
                            </div>
                            {daysOfWeek.map(day => (
                                <div
                                    key={day + hour}
                                    className={`cell ${selectedSlot?.day === day && selectedSlot?.hour === hour ? 'selected' : ''} ${isSlotScheduled(day, hour) ? 'scheduled' : ''}`}
                                    onClick={() => handleSlotClick(day, hour)}
                                >
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className='main-calendar'>
            {renderCalendar()}
        </div>
    );
};

export default Calendar;
