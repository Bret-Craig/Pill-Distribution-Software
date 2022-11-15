import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Alert from "react-bootstrap/Alert";
import { useNavigate } from "react-router-dom";
import axios from 'axios';


export default function SignUp(props) {
  const [username, setUserName] = useState("");
  const [passwrd, setPasswrd] = useState("");
  const [passwrd2, setPasswrd2] = useState("");
  const [name, setName] = useState("");
  const [serialNumber, setSerialNumber] = useState("");
  const [showAlert, setAlert] = useState(false);

  const navigate = useNavigate();

  function verifyPassword()
  {
    if(passwrd === passwrd2)
      {
        setAlert(false);
        return true;
      } else{
        setAlert(true);
        return false;
      }
  }

  function validateForm() {
    return name.length > 0 
            && username.length > 0
            && passwrd.length > 7
            && passwrd2.length > 7
           
  }

  function handleSubmit(event) {
    event.preventDefault();
    if(verifyPassword()){
      props.setUser({username: username, 
        name: name});

      async function makePostCall(stuff){
        try {
          const response = await axios.post('https://pill-distribution-software-be.herokuapp.com/api/users/', stuff);
            return response;
        }
        catch (error) {
            console.log("Username is already taken");
            return false;
        }
      }

      makePostCall({ username: username, password: passwrd, name: name, serialNumber: serialNumber }).then(
        result => {
          if(result && result.status === 201){
            const res = result.data;
            navigate(`/meds?username=${res.username}&name=${res.name}`);
          }else{
            navigate('/signup');
            alert("Username is already taken");
          }
        }
      )
    }
  }

  return (
    <Container className = "align-items-center d-flex" style={{
        height: '100vh'
    }}>
      
      <Form onSubmit={handleSubmit} className ="mx-auto" style={{width: "500px"}}>
      { showAlert ?
        (<Alert variant= "danger">
          Passwords Don't Match!
        </Alert>) : null
      }
      <Form.Group size="lg" controlId="username">
          <Form.Label>Username</Form.Label>
          <Form.Control
            autoFocus
            type="text"
            value={username}
            onChange={(e) => setUserName(e.target.value)}
          />
      </Form.Group>

      <Form.Group size="lg" controlId="name" className="mt-2">
        <Form.Label>Name</Form.Label>
        <Form.Control
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </Form.Group>

      <Form.Group size="lg" controlId="serialNumber" className="mt-2">
        <Form.Label>Serial Number</Form.Label>
        <Form.Control
          type="text"
          value={serialNumber}
          onChange={(e) => setSerialNumber(e.target.value)}
        />
      </Form.Group>

      <Form.Group size="lg" controlId="password" className="mt-3">
        <Form.Label>Password</Form.Label>
        <Form.Control
          type="password"
          value={passwrd}
          onChange={(e) => setPasswrd(e.target.value)}
        />
        <Form.Text className="text-muted">
            password needs to be at least 8 characters long
        </Form.Text>
      </Form.Group>

      <Form.Group size="lg" controlId="verifypassword" className="mb-4 mt-2">
        <Form.Label> Verify Password</Form.Label>
        <Form.Control
          type="password"
          value={passwrd2}
          onChange={(e) => setPasswrd2(e.target.value)}
        />
      </Form.Group>
      
      <Button size="lg" type="submit" className = "mt-2" disabled={!validateForm()}> Submit </Button>
      </Form>
    </Container>
  );
}
