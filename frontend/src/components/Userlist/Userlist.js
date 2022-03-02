/*
Userlist.js
Author: Derek Jeong
Description: Userlist.js is a react hook component for rendering userlist in the chatroom
*/

import React from 'react';
import { Grid } from '@mui/material';

import "./Userlist.css"

export default function Userlist({users}){
        return (
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
        );
}