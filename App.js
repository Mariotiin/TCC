import React from 'react';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from './src/pages/login';
import Cadastro from './src/pages/cadastro';
import Home from './src/pages/home';
import Perfil from './src/pages/perfil';
import CreateParans from './src/pages/createPara';
import EditParans from './src/pages/editPara';
import DashNoti from './src/pages/dashNoti';
import { Provider as PaperProvider } from 'react-native-paper';
import { StatusBar } from 'react-native';
import { UserProvider } from './src/components/estadoUsuario';

const Stack = createStackNavigator();

export default function App() {
  return (
    <UserProvider>
      <PaperProvider>
        <StatusBar backgroundColor="black" barStyle="light-content" />
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen
              name='Login'
              component={Login}
              options={{
                headerShown: false,
                headerTransparent: true,
                title: null,
              }}
            />
            <Stack.Screen
              name='Cadastro'
              component={Cadastro}
              options={{
                headerShown: false,
                headerTransparent: true,
                title: null,
              }}
            />
            <Stack.Screen
              name='Home'
              component={Home}
              options={{
                headerShown: false,
                headerTransparent: true,
                title: null,
              }}
            />
            <Stack.Screen
              name='Perfil'
              component={Perfil}
              options={{
                headerShown: false,
                headerTransparent: true,
                title: null,
              }}
            />
            <Stack.Screen
              name='CreateParans'
              component={CreateParans}
              options={{
                headerShown: false,
                headerTransparent: true,
                title: null,
              }}
            />
            <Stack.Screen
              name='EditParans'
              component={EditParans}
              options={{
                headerShown: false,
                headerTransparent: true,
                title: null,
              }}
            />
            <Stack.Screen
              name='DashNoti'
              component={DashNoti}
              options={{
                headerShown: false,
                headerTransparent: true,
                title: null,
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </UserProvider>
  );
}