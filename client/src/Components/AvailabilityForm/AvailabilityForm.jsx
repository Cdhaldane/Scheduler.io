import React from 'react';
import './AvailabilityForm.css';

const AvailabilityForm = () => {
    return (
        <div>
            <div className="availability-form">
                <div className='employee-name'>
                    <h1>Employee Name</h1>
                </div>
                <button className="availability-block" id="available">
                    Available
                </button>
                <button className="availability-block" id="notAvailable">
                    Not Available
                </button>
            </div>
        </div>
    );
};

export default AvailabilityForm;