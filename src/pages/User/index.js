/* eslint-disable react/static-property-placement */
/* eslint-disable react/sort-comp */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ActivityIndicator } from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import api from '../../services/api';

import {
  Container,
  Header,
  Avatar,
  Name,
  Bio,
  Stars,
  Starred,
  OwnerAvatar,
  Info,
  Title,
  Author,
} from './styles';

export default class Users extends Component {
  // uma propriedade estatica nunca ira enxergar o this, para conseguirmos utilizar
  // informacoes que vem de parametros ou (navigation) precisamos transformar o item estatico em uma funcao que retorna um objeto, passar o parentese entre o objeto.
  static propTypes = {
    navigation: PropTypes.shape({
      navigate: PropTypes.func,
      // definindo as proptypes das propriedades que iremos utilizar
      getParam: PropTypes.func,
    }).isRequired,
  };

  static navigationOptions = ({ navigation }) => ({
    title: navigation.getParam('user').name,
  });
  //   console.tron.log(navigation.getParam('user'));
  //   return { title: ' nome ' };
  // };

  constructor(props) {
    super(props);
    this.state = {
      stars: [],
      loading: false,
      page: 1,
      refreshing: false,
    };
  }

  async componentDidMount() {
    const { page } = this.state;
    const { navigation } = this.props;

    this.setState({ loading: true });

    const user = navigation.getParam('user');

    const response = await api.get(`/users/${user.login}/starred?page=${page}`);

    this.setState({
      stars: response.data,
      loading: false,
    });
  }

  loadMore = async () => {
    const { stars, page } = this.state;

    const nextPage = page + 1;

    const { navigation } = this.props;

    const user = navigation.getParam('user');

    const response = await api.get(
      `/users/${user.login}/starred?page=${nextPage}`
    );

    const { data } = response;

    if (data.length !== 0) {
      this.setState({
        stars: [...stars, ...data],
      });
    }
  };

  refreshList = async () => {
    const { page } = this.state;

    this.setState({
      refreshing: true,
      page: 1,
    });

    const { navigation } = this.props;

    const user = navigation.getParam('user');

    const response = await api.get(`/users/${user.login}/starred?page=${page}`);

    this.setState({
      stars: response.data,
      refreshing: false,
    });
  };

  handleWebView = repo => {
    const { navigation } = this.props; // desestruturando navigation das props..
    navigation.navigate('Repos', { repo });
    // definindo a rota que sera acessada ao executar a funcao.
  };

  render() {
    const { navigation } = this.props;
    const { stars, loading, refreshing } = this.state;
    const user = navigation.getParam('user');

    return (
      <Container loading={loading}>
        <Header>
          <Avatar source={{ uri: user.avatar }} />
          <Name>{user.name}</Name>
          <Bio>{user.bio}</Bio>
        </Header>

        {loading ? (
          <ActivityIndicator color="#7159c1" size={60} />
        ) : (
          <Stars
            onEndReachedThreshold={0.2} // Carrega mais itens quando chegar em 20% do fim
            onEndReached={this.loadMore} // Função que carrega mais itens
            onRefresh={this.refreshList} // Função dispara quando o usuário arrasta a lista pra baixo
            refreshing={refreshing} // Variável que armazena um estado true/false que representa se a lista está atualizando
            data={stars}
            keyExtractor={star => String(star.id)}
            renderItem={({ item }) => (
              <Starred>
                <OwnerAvatar source={{ uri: item.owner.avatar_url }} />
                <Info>
                  <Title
                    onPress={
                      () => this.handleWebView(item)
                      // (
                      // <WebView
                      //   source={{ uri: item.html_url }}
                      //   style={{ flex: 1 }}
                      // />
                      // )
                    }
                  >
                    {item.name}
                  </Title>
                  <Author>{item.owner.login}</Author>
                </Info>
              </Starred>
            )}
          />
        )}
      </Container>
    );
  }
}
