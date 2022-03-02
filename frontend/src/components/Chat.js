/*
Chat.js
Author: Derek Jeong
Description: Chat.js is a react hook component for rendering chatting box with input box
*/
import React, { useState, useEffect, useRef } from "react";
import queryString from "query-string";
import io from "socket.io-client";
import { useHistory } from "react-router-dom";
import { Paper, Button, Grid } from '@mui/material';

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
        const messagesEndRef = useRef(null);


        // scroll down when new message added
        const scrollToBottom = () => {
                if (!!messagesEndRef.current.scrollHeight){
                const scroll = messagesEndRef.current.scrollHeight - messagesEndRef.current.clientHeight;
                messagesEndRef.current.scrollTo(0, scroll);        
                }
        }

        useEffect(() => {
                const { username , room } = queryString.parse(window.location.search);
                socket = io(endpoint);
                console.log(socket.clients);
                setUsername(username);
                setRoom(room);

                socket.emit("join", {username, room}, (error) => {
                        scrollToBottom();
                        if (error) alert(error);
                });
                socket.on('roomData', ({room, users}) => {
                        setUsers([...users]);
                        console.log("users:", users);
                });
        }, [window.location]);

        useEffect(() => {
                socket.on("message", (message) => {
                        scrollToBottom();
                        setMessages((messages) => [...messages, message]);
                });
                socket.on('roomData', ({room, users}) => {
                        setUsers([...users]);
                        console.log("users:", users);
                });
        }, []);

        const handleSendMsg = (e) => {
                e.preventDefault();
                if (massage) {
                        socket.emit("sendMessage", massage );
                        setMassage("");
                } else alert("empty input");
        };

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
                                <Grid item xs={7} className="chatBox" ref={messagesEndRef}> 
                                <div>
                                {messages.map((v, i) => (
                                        <div key={i}>
                                                <b>{v.user}: {v.text}</b>
                                        </div>
                                ))}
                                </div>
                                </Grid>
                                <Grid item xs={4} className="userList"> 
                                <div>
                                <h3>User List</h3>
                                {users.map((v, i) => (
                                        <div key={i}>
                                                <b>{v.username}</b>
                                        </div>
                                ))}
                                </div>
                                </Grid>
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