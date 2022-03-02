/*
Chat.js
Author: Derek Jeong
Description: Chat.js is a react hook component for rendering chatting room page with user input from Home page 
*/
import React, { useState, useEffect, useRef } from "react";
import queryString from "query-string";
import io from "socket.io-client";
import { useHistory } from "react-router-dom";
import { Paper, Button, Grid } from '@mui/material';

import Message from "../Message/Message";
import Userlist from "../Userlist/Userlist";
import "./Chat.css";

let socket;

export default function Chat(){
        const history = useHistory();
        const [username, setUsername] = useState("");
        const [room, setRoom] = useState("");
        const [users, setUsers] = useState([]);
        const [messages, setMessages] = useState([]);
        const [massage, setMassage] = useState("");
        const endpoint = "http://localhost:3080";

        // side effect when a user join the chat room
        useEffect(() => {
                const { username , room } = queryString.parse(window.location.search);
                socket = io(endpoint);
                setUsername(username);
                setRoom(room);

                socket.emit("join", {username, room}, (error) => {
                        // scrollToBottom();
                        if (error) alert(error);
                });
        }, []);

        // side effect when message send and update room data
        useEffect(() => {
                socket.on("message", (message) => {
                        // scrollToBottom();
                        setMessages((messages) => [...messages, message]);
                });
                socket.on('roomData', ({users}) => {
                        setUsers(users);
                        console.log("users:", users);
                });
        }, []);

        // send message with form submit handler
        const handleSendMsg = (e) => {
                e.preventDefault();
                if (massage) {
                        socket.emit("sendMessage", massage );
                        setMassage("");
                } else alert("empty input");
        };

        // when a user signed out, redirect to home page
        const handleSignOut = (e) => {
                e.preventDefault();
                socket.close();
                history.push("/");     
        }
    
        return (
                <div className="wrapper">
                        <Paper elevation={3}>
                        <Grid
                        container
                        direction="row"
                        justifyContent="center"
                        alignItems="center"
                        wrap="wrap"
                        spacing={0}
                        >
                                <Grid item xs={12}>
                                <h2>{room} chatroom</h2>
                                </Grid>
                                <Grid item xs={12} style={{textAlign: "right"}} >
                                <Button type="submit" onClick={handleSignOut}>Sign Out</Button>
                                </Grid>
                                <Message messages={messages}/>
                                <Userlist users={users}/>
                                <Grid item xs={12}> 
                                <form action="" onSubmit={handleSendMsg} className="inputBox">
                                <input
                                style={{width: "80%"}}
                                type="text"
                                value={massage}
                                onChange={(e) => setMassage(e.target.value)}
                                />
                                <Button type="submit">Send</Button>
                                </form>
                                </Grid>
                        </Grid>
                        </Paper>
                </div>
        );
};