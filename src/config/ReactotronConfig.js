import Reactotron from 'reactotron-react-native';

if (__DEV__) {
  // __DEV__ variavel global que retorna true se estiver rodando a aplicação em ambiente de desenvolvimento.
  const tron = Reactotron.configure({ host: '10.0.0.114' })
    .useReactNative()
    .connect();

  tron.clear();

  console.tron = tron; // pegamos o console e estamos criando uma nova propriedade tron.
}
