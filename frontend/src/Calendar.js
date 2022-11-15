import React, { useState, useEffect } from "react";
import queryString from 'query-string';
import { useLocation } from 'react-router';
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Select from 'react-select';
import { medicationOptions } from './Medications';
import axios from 'axios';

const days = [
  { value: 0, label: 'Sunday' },
  { value: 1, label: 'Monday' },
  { value: 2, label: 'Tuesday' },
  { value: 3, label: 'Wednesday' },
  { value: 4, label: 'Thursday' },
  { value: 5, label: 'Friday' },
  { value: 6, label: 'Saturday' }];


function CalendarHeader() {
  return (
    <thead>
      <tr>
        <th>Sunday</th>
        <th>Monday</th>
        <th>Tuesday</th>
        <th>Wednesday</th>
        <th>Thursday</th>
        <th>Friday</th>
        <th>Saturday</th>
      </tr>
    </thead>
  );
}

function findDay(day){
  if(day === "Sunday")
    return 0;
  else if (day === "Monday")
    return 1;
  else if (day === "Tuesday")
    return 2;
  else if (day === "Wednesday")
    return 3;
  else if (day === "Thursday")
    return 4;
  else if (day === "Friday")
    return 5;
  else if (day === "Saturday")
    return 6;
}

function Calendar() {
  const location = useLocation()
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [medication, setMedication] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [day, setDay] = useState([]);
  const [table, setTable] = useState(
    Array.from({ length: 7 }, v => Array.from({ length: 10 }, v => ''))
  )
  useEffect(() => {
    const { username, name } = queryString.parse(location.search)

    setUsername(username)
    setName(name)
    async function loadMed(stuff) {
      try {
        const response = await axios.post('https://pill-distribution-software-be.herokuapp.com/api/users/loadMed', stuff);
        return response;
      }
      catch (error) {
        console.log(error)
        return false;
      }
    }
    loadMed({ username: username }).then(
      result => {
        if (result && result.status === 200) {
          let copy = [...table];
          const res = result.data.meds
          for (let i = 0; i < res.length; i++) {
            let j = 0;
            let day = findDay(res[i].day)
            while (copy[j][day] !== '') {
              j++;
            }
            copy[j][day] = res[i].medication + ": " + res[i].dosage;
          }
          setTable(copy);
        }
      }
    )
  }, [location.search])


  function handleSubmit(event) {
    event.preventDefault();
    async function makePostCall(stuff) {
      try {
        const response = await axios.post('https://pill-distribution-software-be.herokuapp.com/api/users/addMed', stuff);
        return response;
      }
      catch (error) {
        console.log(error)
        return false;
      }
    }
    makePostCall({ username: username, medication: medication, dosage: quantity, dayNum: day }).then(
      result => {
        if (result && result.status === 201) {
          let copy = [...table];
          for (let i = 0; i < day.length; i++) {
            let j = 0;
            while (copy[j][day[i]] !== '') {
              j++;
            }
            copy[j][day[i]] = medication + ": " + quantity;
          }
          setTable(copy);
        } else {
          
          window.alert('You cannot have two meds of the same med in a day')
        }
      }
    )
    
  }

  function CalendarBody() {
    console.log(table);
    return (
      <tbody>
        {table.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {row.map((column, columnIndex) => (
              <td key={columnIndex}><Button variant="clear" onClick={() => { handleClick(rowIndex, columnIndex) }}>{column}</Button></td>
            ))}
          </tr>
        ))}
      </tbody>
    );
  }

  function handleClick(rowIndex, columnIndex) {
    let copy = [...table];
    var split = copy[rowIndex][columnIndex].split(": ")
    async function makePostCall(stuff) {
      try {
        const response = await axios.post('https://pill-distribution-software-be.herokuapp.com/api/users/delMed', stuff);
        return response;
      }
      catch (error) {
        console.log(error)
        return false;
      }
    }

    makePostCall({ username: username, medication: split[0], dosage: split[1], dayNum: columnIndex }).then(
      result => {
        if (result && result.status === 200) {
          for (let i = rowIndex + 1; i <= 10; i++) {
            if (copy[i][columnIndex] === '') break;
            copy[i - 1][columnIndex] = copy[i][columnIndex];
            copy[i][columnIndex] = '';
          }
          setTable(copy);
        } else {
          window.alert('There was an error deleting the med')
        }
      }
    )
  }


  return (
    <Container className="align-items-center d-flex" style={{
      height: '120vh'
    }}>

      <Form onSubmit={handleSubmit} className="mx-auto" style={{ width: "1300px" }}>
        {/* { showAlert ?
      (<Alert variant= "danger">
        Passwords Don't Match!
      </Alert>) : null
    } */}


        <Form.Group size="lg" controlId="classes" className="mt-2">
          <Form.Label>Medication</Form.Label>
          <Select
            name="medication"
            options={medicationOptions}
            className="basic-multi-select"
            classNamePrefix="select"
            onChange={(value) =>
              setMedication(value.value)}
          />
          <Form.Label>Quantity</Form.Label>
          <input type="text"
            name="quantity"
            onChange={(value) =>
              setQuantity(value.target.value)}
          />
          <Form.Label>Day</Form.Label>
          <Select
            isMulti
            name="day"
            options={days}
            className="basic-multi-select"
            classNamePrefix="select"
            onChange={(value) =>
              setDay(value.map(d => d.value))}
          />
        </Form.Group>
        <table>
          <CalendarHeader />
          <CalendarBody />
        </table>

        <Button size="lg" type="submit" className="mt-2" > Submit </Button>
      </Form>
    </Container>
  );
}
export default Calendar;