/*
Home.js
Author: Derek Jeong
Description: Home.js is a react hook component for rendering login page with login form
        user can set username and room name to connect with socket.io
*/
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { Paper, TextField, Button } from '@mui/material';

import "./Home.css";

export default function Home(){
        const history = useHistory();
        const [username, setUsername] = useState("");
        const [room, setRoom] = useState("");

        // to submit user inputs and redirect to chat page
        const handleSubmit = (e) => {
                if(!username || !room){
                        e.preventDefault();
                } else {
                        history.push(`/chat?username=${username}&room=${room}`);
                }
        }

        return (
        <div className="wrapper">
                <div>
                <h1 style={{color: "white"}}>Welcome to Ezoic Chat!</h1>
                <Paper elevation={3} className="formBox">
                        <form onSubmit={handleSubmit}>
                                <TextField
                                className="textInput"
                                style={{marginBottom: "15px"}}
                                id="name"
                                label="Name"
                                type="text"
                                onChange={(event) => setUsername(event.target.value)}
                                required
                                />
                                <TextField
                                className="textInput"
                                style={{marginBottom: "15px"}}
                                id="room"
                                label="Room"
                                type="text"
                                onChange={(event) => setRoom(event.target.value)}
                                required
                                />

                                <Button className="btn" type="submit">
                                Sign In
                                </Button>
                        </form>
                        
                </Paper>
                </div>
        </div>
        );
};