/* eslint-disable react/sort-comp */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { WebView } from 'react-native-webview';

// import { Container } from './styles';

export default class Repos extends Component {
  // informacoes que vem de parametros ou (navigation) precisamos transformar o item estatico em uma funcao que retorna um objeto, passar o parentese entre o objeto.
  // eslint-disable-next-line react/static-property-placement
  static propTypes = {
    navigation: PropTypes.shape({
      getParam: PropTypes.func,
      // definindo as proptypes das propriedades que iremos utilizar
    }).isRequired,
  };

  static navigationOptions = ({ navigation }) => ({
    title: navigation.getParam('repo').name,
  });
  // {
  //   console.tron.log(navigation.getParam('repo').html_url);
  //   return { title: 'OK' };
  // };

  // ({
  //   title: navigation.getParam('repo').name, // o getParam retorna um dos parametros enviados na rota
  // });

  render() {
    const { navigation } = this.props;
    const repos = navigation.getParam('repo');

    return <WebView source={{ uri: repos.html_url }} style={{ flex: 1 }} />;
  }
}
