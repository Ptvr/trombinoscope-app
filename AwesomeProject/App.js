import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StyleSheet, View, Text } from 'react-native';
import HomeScreen from './screens/Home/Home';
import MessScreen from './screens/Message/Message';
import TrombiScreen from './screens/Trombi/Trombi';
import LoginScreen from './screens/Login/Login';
import SettingsScreen from './screens/Settings/Settings';
// Importez les modules nécessaires de React Navigation
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import LandingScreen from './screens/Home/LandingPage'

// Créez une navigation de bas de page
const Tab = createBottomTabNavigator();

const App = () => {
  const [dataMe, setDataMe] = useState([]);
  const [data, setData] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [landing, setLanding] = useState(true);
  const [follow, setFollow] = useState([]);
  const [allProfileImage, setAllProfileImage] = useState([]);
  
  // Effectuer la vérification de connexion lors du chargement de l'application
  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = await getAccessToken();
      if (token) {
        try {
          const response = await fetch('https://masurao.fr/api/employees/me', {
            method: 'GET',
            headers: {
              'accept': 'application/json',
              'X-Group-Authorization': '67e1f8751d4deb177783d5e5ab9ec276',
              'Authorization': 'Bearer ' + token,
            },
          });
          if (response.ok) {
            const data = await response.json();
            setDataMe(data);
            setIsLoggedIn(true);
          } else {
            setIsLoggedIn(false);
          }
        } catch (error) {
          setIsLoggedIn(false);
        }
      } else {
        setIsLoggedIn(false);
      }
    };

    checkLoginStatus();
  }, []);

  const getFollow = async () => {
    try {
      let fol = await AsyncStorage.getItem('follow');
      console.log(fol);
      if (fol !== null) {
        fol = JSON.parse(fol);
        console.log(fol);
        setFollow(fol);
      }
    } catch (error) {
      console.error('Erreur de récupération des follow:', error);
      return null;
    }
  };

  useEffect(() => {
    getFollow();
  }, []);

  const getAccessToken = async () => {
    try {
      const token = await AsyncStorage.getItem('access_token');
      return token;
    } catch (error) {
      console.error('Erreur de récupération de l\'access token:', error);
      return null;
    }
  };

  const updateLoginStatus = (status) => {
    setIsLoggedIn(status);
  };

  return (
    <View style={styles.container}>
      {isLoggedIn ? (landing ? (<LandingScreen setLanding={setLanding}/>) :
        (<NavigationContainer>
        <Tab.Navigator screenOptions={{
    tabBarStyle: { backgroundColor: 'rgba(255, 250, 255, 1)' }, 
    tabBarActiveTintColor: 'rgba(255,57,86,0.7)', 
    tabBarInactiveTintColor: 'black', 
  }}>
  <Tab.Screen
    name="Home"
    options={{
      tabBarIcon: ({ color, size }) => (
        <FontAwesome5 name="home" color={color} size={size} /> 
      ),
    }}
  >
    {() => <HomeScreen dataMe={dataMe} follow={follow} data={data} setData={setData} setAllProfileImage={setAllProfileImage} setLanding={setLanding} />}
  </Tab.Screen>
  <Tab.Screen
  name="Trombi"
  options={{
    tabBarIcon: ({ color, size }) => (
      <FontAwesome5 name="images" color={color} size={size} /> 
    ),
  }}
>
{() => <TrombiScreen dataMe={dataMe} data={data} follow={follow} setFollow={setFollow} allProfileImage={allProfileImage} />}
</Tab.Screen>
<Tab.Screen
  name="Chat"
  options={{
    tabBarIcon: ({ color, size }) => (
      <FontAwesome5 name="comment" color={color} size={size} />
    ),
  }}
>
{() => <MessScreen dataMe={dataMe} follow={follow} allData={data} allProfileImage={allProfileImage} />}
</Tab.Screen>
<Tab.Screen
  name="Settings"
  options={{
    tabBarIcon: ({ color, size }) => (
      <FontAwesome5 name="cogs" color={color} size={size} /> // Use the appropriate FontAwesome5 icon name
    ),
  }}
>
  {() => <SettingsScreen dataMe={dataMe} updateLoginStatus={updateLoginStatus} />}
</Tab.Screen>
        </Tab.Navigator>
      </NavigationContainer>)
      ) : 
      (<LoginScreen updateLoginStatus={updateLoginStatus}/>)}
    </View>
  );
}

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(255, 220, 233, 0.3)',
  },
});

