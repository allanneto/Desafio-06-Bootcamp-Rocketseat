/* eslint-disable react/static-property-placement */
/* eslint-disable react/sort-comp */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AsyncStorage from '@react-native-community/async-storage'; // importando o async storage para poder salvar as coisas no android, funciona como o localStorage porem por ele ser assincrono precisamos usar o await, ele demora um pouquinho para salvar as coisas nele.
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Keyboard, ActivityIndicator } from 'react-native'; // importando Keyboard para poder manipular o teclado e as acoes, ActivityIndicator para poder manipular quando estiver ocorrendo uma atividade
import api from '../../services/api'; // importando arquivo de axios que ira fazer as requisicoes, ele contem a baseUrl
import {
  Container,
  Form,
  Input,
  SubmitButton,
  List,
  User,
  Avatar,
  Name,
  Bio,
  ProfileButton,
  ProfileButtonText,
  RemoveUser,
} from './styles';

export default class Main extends Component {
  constructor(props) {
    // definir sempre um constructor para que o eslint nao de zika
    super(props);
    this.state = {
      newUser: '',
      users: [],
      loading: false,
      duplicate: false,
    };
  }

  static propTypes = {
    navigation: PropTypes.shape({
      navigate: PropTypes.func,
    }).isRequired,
  };

  static navigationOptions = {
    title: 'Users',
  };

  async componentDidMount() {
    const users = await AsyncStorage.getItem('users');

    if (users) {
      this.setState({ users: JSON.parse(users) });
    }
  }

  componentDidUpdate(_, prevState) {
    const { users } = this.state;

    if (prevState.users !== users) {
      AsyncStorage.setItem('users', JSON.stringify(users));
    }
  }

  // handleAddUser() {}
  handleAddUser = async () => {
    const { users, newUser } = this.state;

    this.setState({ loading: true, duplicate: false });

    try {
      const error = await users.find(e => e.login === newUser);

      if (error) {
        throw new Error('Duplicated user');
      }

      const response = await api.get(`/users/${newUser}`);

      const data = {
        name: response.data.name,
        login: response.data.login,
        bio: response.data.bio,
        avatar: response.data.avatar_url,
      };

      this.setState({
        users: [...users, data],
        newUser: '',
        loading: false,
        duplicate: false,
      });

      Keyboard.dismiss();
    } catch (err) {
      this.setState({
        loading: false,
        duplicate: true,
        newUser: '',
      });
    }
  };

  handleNavigate = user => {
    const { navigation } = this.props; // desestruturando navigation das props..
    navigation.navigate('User', { user });
    // definindo a rota que sera acessada ao executar a funcao.
  };

  handleDelete = async user => {
    const { login } = user;
    const { users } = this.state;

    const selectedUser = await users.find(u => u.login === login);

    if (selectedUser) {
      const index = users.indexOf(selectedUser);

      users.splice(index, 1);

      this.setState({ users });

      AsyncStorage.setItem('users', JSON.stringify(users));
    }
  };

  render() {
    const { users, newUser, loading, duplicate } = this.state;

    return (
      <Container>
        <Form>
          <Input
            autoCorrect={false}
            autoCapitalize="none"
            placeholder="Adicionar Usuario"
            value={newUser}
            onChangeText={text =>
              this.setState({ newUser: text, duplicate: false })
            }
            returnKeyType="send"
            onSubmitEditing={this.handleAddUser}
            duplicate={duplicate}
          />
          <SubmitButton loading={loading} onPress={this.handleAddUser}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Icon name="add" size={20} color="#fff" />
            )}
          </SubmitButton>
        </Form>

        <List
          data={users}
          KeyExtractor={user => String(user.login)}
          renderItem={({ item }) => (
            <User>
              <RemoveUser>
                <Icon
                  name="remove"
                  size={20}
                  color="#303030"
                  onPress={() => this.handleDelete(item)}
                />
              </RemoveUser>
              <Avatar source={{ uri: item.avatar }} />
              <Name>{item.name}</Name>
              <Bio>{item.bio}</Bio>

              <ProfileButton onPress={() => this.handleNavigate(item)}>
                {/* q uando precisamos passar uma funcao para ser executa precisamo criar uma nova funcao. */}
                <ProfileButtonText>Ver Perfil</ProfileButtonText>
              </ProfileButton>
            </User>
          )}
        />
      </Container>
    );
  }
}
