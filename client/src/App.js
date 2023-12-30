import React, { useState, useEffect } from 'react';

import './App.css';
import Calendar from './components/calendar/calendar';
import Sidebar from './components/sidebar/sidebar';
import ScheduleForm from './components/schedule-form/schedule-form';

function App() {
  const [personID, setPersonID] = useState(0);
  const [selectedSlot, setSelectedSlot] = useState(0);

  useEffect(() => {
    
  }, [selectedSlot]);

  const handleSelectedSlot = (e) => {
    console.log('selectedSlot', e);
    setSelectedSlot({day: e.day, hour: e.hour})
  }
  return (
    <div className="app">
      <Sidebar setPersonID={setPersonID} />
      <div className='main-header'>
        <h1>Scheduler.io {personID}</h1>
      </div>
      <div className='main'>
        <Calendar personID={personID} handleSelectedSlot={(e) => handleSelectedSlot(e)} />
        <ScheduleForm personID={personID} selectedSlot={selectedSlot}/>
      </div>

    </div>
  );
}

export default App;
