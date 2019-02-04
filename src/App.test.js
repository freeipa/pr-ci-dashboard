import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { BrowserRouter as Router } from "react-router-dom";
import localStorageMock from './mocks/localStorageMock';

localStorageMock.register();

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Router><App /></Router>, div);
  ReactDOM.unmountComponentAtNode(div);
});
