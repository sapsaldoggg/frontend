import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import TokenStorage from './db/token';
import HttpClient from './network/http';
import { AuthErrorEventBus, AuthProvider } from './context/AuthContext';
import AuthService from './service/auth';
import { BrowserRouter } from 'react-router-dom';
import KakaoService from './service/kakao';

const baseURL = 'http://localhost:8080';
const tokenStorage = new TokenStorage();
const httpClient = new HttpClient(baseURL);
const authErrorEventBus = new AuthErrorEventBus();
const authService = new AuthService(httpClient, tokenStorage);
const kakaoService = new KakaoService(httpClient, tokenStorage);
const { kakao } = window;
ReactDOM.render(
  <BrowserRouter>
    <AuthProvider
      authService={authService}
      authErrorEventBus={authErrorEventBus}
    >
      <App kakaoService={kakaoService} />
    </AuthProvider>
  </BrowserRouter>,

  document.getElementById('root')
);
