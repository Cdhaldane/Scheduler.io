import React from 'react';
import './AvailabilityForm.css';

/**
 * `AvailabilityForm` is a functional component that renders a form with two buttons to set the availability status of an employee.
 * 
 * Inputs:
 * - None: This component does not take any props or arguments.
 * 
 * Outputs:
 * - JSX: The output is a JSX element that contains a form with a title and two buttons.
 * 
 * Purpose:
 * - The purpose of this component is to provide a simple interface where an employee's availability can be marked as 'Available' or 'Not Available'.
 * - It is designed to be used TimeSlot to manage employees' schedule.
 * 
 */

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