/*
Routes.js
Author: Derek Jeong
Description: Routes.js is a react router to redirect other pages
*/

import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Home from "./components/Home/Home";
import Chat from "./components/Chat/Chat";
import NotFound from "./components/404";

export default function Routing() {

        return (
                <BrowserRouter>
                        <Switch>
                                <Route exact path="/">
                                        <Home />
                                </Route>
                                <Route path="/chat">
                                        <Chat />
                                </Route>
                                <Route>
                                        <NotFound />
                                </Route>
                        </Switch>
                </BrowserRouter>
        );
}