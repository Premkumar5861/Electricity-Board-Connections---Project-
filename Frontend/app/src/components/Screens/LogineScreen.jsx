import React, {useState} from "react";
import { Form, Button} from "react-bootstrap"
import axios from 'axios';

function LogineScreen() {
     
    const [username,setUsername] = useState("");
    const [ password, setPassword] = useState("");

    const handleSubmit = async(e) =>{
        e.preventDefault();
        // Add your login logic here , such a s sending a request to your backend serever.
        try{
            const response = await axios.post("/api/login/",{
                username,
                password,
            })
            console.log("Login successful",response.data);
            
            // store user data in localstorage
            localStorage.setItem("userData",JSON.stringify(response.data));

            // Redirect the user or perfect any other actions upon successful login.

        }
        catch(error){
            console.log("Login error:",error.response.data);
            // set error message for display.
            // setError(error.response.data.message);

        
        }

        //Clear the from fields after submission

        setUsername("");
        setPassword("");

    }


  return (
    <div className="container">
        <h2 className="mt-2">Login</h2>
        <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formBasicUsername">
                <Form.Label className="mb-2">
                    Username
                </Form.Label>
                <Form.Control
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e)=> setUsername(e.target.value)}
                required
                >

                </Form.Control>

            </Form.Group>
            <Form.Group contolID="formBasicUsername">
                <Form.Label className="mt-2">
                    Password
                </Form.Label>
                <Form.Control
                type="password"
                placeholder="Enter Password"
                value={password}
                onChange={(e)=> setPassword(e.target.value)}
                required
                >

                </Form.Control>

            </Form.Group>
            <Button className="my-3" variant="primary" type="submit">
                Login

            </Button>

        </Form>

    </div>
  )
}

export default LogineScreen