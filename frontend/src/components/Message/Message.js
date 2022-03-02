/*
Message.js
Author: Derek Jeong
Description: Message.js is a react hook component for rendering message on the chatroom
*/

import React, { useEffect, useRef } from 'react';
import { Grid } from '@mui/material';

import "./Message.css"

export default function Message({messages}){
        const messagesEndRef = useRef(null);

        // scroll down when new message added
        const scrollToBottom = (scroll) => {
                if (!!messagesEndRef.current.scrollHeight){
                scroll = messagesEndRef.current.scrollHeight - messagesEndRef.current.clientHeight;
                messagesEndRef.current.scrollTo(0, scroll);        
                }
        }

        //side effect to scroll down when message added on chatroom
        useEffect(() => {
                let scroll;
                scrollToBottom(scroll);
        });

        return (
                <Grid item xs={7} className="chatBox" ref={messagesEndRef}>
                        <div>
                                {messages.map((v, i) => (
                                        <div key={i}>
                                                <b>{v.user}: {v.text}</b>
                                        </div>
                                ))}
                        </div>
                </Grid>
        );
}