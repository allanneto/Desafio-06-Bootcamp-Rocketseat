import { createAppContainer } from 'react-navigation';
// o createAppContainer toda a navegação  da aplicação
import { createStackNavigator } from 'react-navigation-stack';

import Main from './pages/Main';
import User from './pages/User';
import Repos from './pages/Repos';

const Routes = createAppContainer(
  // semppre que formos usar um tipo de navigator devemos colocar dentro do AppContainer se nao ela nao vai funcionar
  createStackNavigator(
    {
      // estamos usando o navigator de stack e depois definindo quais componentes irao usar ele.
      Main,
      User,
      Repos,
    },
    {
      headerLayoutPreset: 'center',
      headerBackTitleVisible: false,
      defaultNavigationOptions: {
        headerStyle: {
          backgroundColor: '#7159c1',
        },
        headerTintColor: '#fff',
      },
    }
  )
);

export default Routes;
