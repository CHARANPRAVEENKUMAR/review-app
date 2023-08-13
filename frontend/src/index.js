import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {BrowserRouter} from 'react-router-dom'; //for routing

ReactDOM.render(
<BrowserRouter>
<App/>
</BrowserRouter>,
document.getElementById('root'));