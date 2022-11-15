import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

export default function Login(props) {

  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  function validateForm() {
    return username.length > 0 && password.length > 0;
  }

  function handleSubmit(event) {
    event.preventDefault();

      async function makePostCall(stuff){
        try {
          const response = await axios.post('https://pill-distribution-software-be.herokuapp.com/api/users/login/', stuff);
            return response;
        }
        catch (error) {
            console.log("Username is already taken");
            return false;
        }
      }

      makePostCall({username: username, password: password}).then(
        result => {
          if(result && result.status === 200){
            const res = result.data;
            console.log(res);
            props.setUser({username: res.username, 
              name: res.name});
            navigate(`/meds?username=${res.username}&name=${res.name}`);
          }else{
            console.log(result);
            navigate('/');
          }
        }
      )
    }

  return (
    <Container className = "align-items-center d-flex" style={{
        height: '100vh'
    }}>
      <Form onSubmit={handleSubmit} className ="mx-auto" style={{width: "500px"}}>
        <Form.Group size="lg" controlId="username">
          <Form.Label>Username</Form.Label>
          <Form.Control
            autoFocus
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </Form.Group>
        <Form.Group size="lg" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>
        <Button size="lg" type="submit" className = "mt-2 me-2" disabled={!validateForm()}> Sign-in </Button>
        
        <Button size="lg" variant="secondary" className = "mt-2" onClick ={() => navigate("/signup")}> Sign-up </Button>
        
      </Form>
    </Container>
  );
}