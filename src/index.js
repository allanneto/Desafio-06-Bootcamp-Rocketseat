import React from 'react';

import { StatusBar } from 'react-native';

import './config/ReactotronConfig'; // importando Reactotron para debuggar a aplicação.

import Routes from './routes'; // importando o arquivo routes que sera instanciado abaixo como uma Tag

console.tron.log('PELO AMOR DE DEUS FUNCIONA CARALHO');

export default function App() {
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#7159c1" />
      <Routes />
    </>
  );
}
