import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {BrowserRouter} from 'react-router-dom'; //for routing
import "./index.css"

import ContextProviders from './context';

const rootElement = document.getElementById("root");
const root = ReactDOM.createRoot(rootElement);

root.render(
<BrowserRouter>
<ContextProviders>
    <App/>
</ContextProviders>
</BrowserRouter>,
);


/* <BrowserRouter>
<NotificationProvider>
<ThemeProvider>
<App/>
</ThemeProvider>
</NotificationProvider>
</BrowserRouter>, how it looks earlier */