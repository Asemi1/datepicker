import React, { useState } from 'react';
import { format, differenceInDays, parseISO } from 'date-fns';
import axios from "axios";

const Datepicker = () => {
  const [showDatePickers, setShowDatePickers] = useState(false);
  const [days, setDays] = useState('');
  const [start_date, setStart_date] = useState(new Date());
  const [finish_date, setFinish_date] = useState(new Date());

  const handleCheckboxChange = () => {
    setShowDatePickers(!showDatePickers);
  };

  const handleDaysChange = (event) => {
    setDays(event.target.value);
  };


  const handleStart_dateChange = (date) => {
    setStart_date(date);
    // Проверка на дату начала не позже даты конца
    if (showDatePickers && differenceInDays(date, finish_date) > 0) {
        setFinish_date(date);
        }
  };

  const handleFinish_dateChange = (date) => {
    setFinish_date(date);
    // Проверка на дату конца не раньше даты начала
    if (differenceInDays(date, start_date) < 0) {
      setStart_date(date);
    }
  };

  const handleSubmit = () => {


    // Проверка на ввод
    if (!days.trim()) {
        alert('Пожалуйста, введите число дней');
        return;
    }

    // Проверка на максимальное количество дней
    if (showDatePickers && differenceInDays(finish_date, start_date) > 60) {
      alert('Максимальный период между датами - 60 дней');
      return;
    }

    // Отправка данных на API
    const apiUrl = 'https://d5dtm154j1mae38k86vh.apigw.yandexcloud.net/test';
    // const apiUrl = '/';

    const dataToSend = {
        start_date: format(start_date, 'yyyy-MM-dd HH:mm:ss'),
        finish_date: showDatePickers ? format(finish_date, 'yyyy-MM-dd HH:mm:ss') : null,
        // start_date: start_date.toISOString(),
        // finish_date: showDatePickers ? finish_date.toISOString() : null,
        days: parseInt(days),
      };
      console.log(dataToSend)
  
      axios.post(apiUrl, dataToSend)
        .then((response) => {
          console.log('API response:', response.data);
        })
        .catch((error) => {
          console.error('Error sending data to API:', error);
        });

  };

  return (
    <div className='form'>
        <label className="form-box__label">Число дней</label>
        <input 
            type="number" 
            name="days" 
            value={days} 
            onChange={handleDaysChange} 
        />

        <div>
            <label className="form-box__label">Показать datepicker</label>
            <input
            type="checkbox"
            checked={showDatePickers}
            onChange={handleCheckboxChange}
            />
        </div>

    {showDatePickers && (
        <div>
            <div>
                <label className="form-box__label">Дата начала:</label>
                <input
                type="date"
                value={format(start_date, 'yyyy-MM-dd')}
                // value={start_date.toISOString().slice(0, 16)}
                onChange={(e) => handleStart_dateChange(parseISO(e.target.value))}
                
                />
            </div>
            <div>
                <label className="form-box__label">Дата конца:</label>
                <input
                type="date"
                value={format(finish_date, 'yyyy-MM-dd')}
                // value={finish_date.toISOString().slice(0, 16)}
                onChange={(e) => handleFinish_dateChange(parseISO(e.target.value))}
                />
            </div>

            

        </div>
      )}

        <button onClick={handleSubmit}>Submit</button>
    </div>
  );
};

export default Datepicker;
