import { useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';

const DateSelect = ({ value, setValue, label, disabled = false }) => {
    const [dateInput, setDateInput] = useState('');

    useEffect(() => {
        if (dateInput?.length === 10) {
            const [yr, mo, d] = dateInput.split('-');
            const date = new Date(Date.UTC(yr, mo - 1, d, 12)).toISOString();
            setValue(date);
        }
    }, [dateInput]);

    return (
        <>
            <Form.Label>{label}</Form.Label>
            <Form.Control
                type="date"
                value={dateInput || value}
                onChange={(e) => setDateInput(e.target.value)}
                disabled={disabled}
            />
        </>

    )
}

export default DateSelect;