import React, { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StyleSheet, TextInput, View, Text, ImageBackground, TouchableOpacity, Image } from 'react-native';

const LoginScreen = ({updateLoginStatus}) => {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorCred, setErrorCred] = useState('');
  
    const handleLogin = () => {
      setErrorCred('Loading...');
      console.log('Nom d\'utilisateur:', username);
      console.log('Mot de passe:', password);
  
      const fetchData = async () => {
        try {
          const reponse = await fetch('https://masurao.fr/api/employees/login',
            {method: 'POST',
            headers: {
              'accept': 'application/json',
              'X-Group-Authorization': '67e1f8751d4deb177783d5e5ab9ec276',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: username,
              password: password,
            }),
          });
          if (reponse.ok) {
            const jsonData = await reponse.json();
            console.log(jsonData);
            setErrorCred('');
            try {
              await AsyncStorage.setItem('access_token', jsonData.access_token);
            } catch (error) {
              console.error('Erreur de stockage de l\'access token:', error);
            }
            updateLoginStatus(true);
          } else {
            const jsonData = await reponse.json();
            setErrorCred(jsonData.detail);
          }
        } catch (error) {
          console.error('Erreur lors de la récupération des données:', error);
          setErrorCred('Erreur lors de la récupération des données');
        }
      };
  
      fetchData();
  
    };
  
    return (
        <ImageBackground
          source={require('../../assets/back.png')}
          style={styles.backgroundImage}
        >
          <View style={styles.loginContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Login"
              onChangeText={text => setUsername(text)}
              value={username}
            />
            <TextInput
              style={styles.passwordInput}
              placeholder="Password"
              onChangeText={text => setPassword(text)}
              value={password}
              secureTextEntry={true}
            />
            <Text>{errorCred}</Text>
            <View style={styles.loginButton}>
            <TouchableOpacity
              style={styles.loginButton}
              onPress={handleLogin}
            >
            <ImageBackground
            source={require('../../assets/button.png')}
            style={[styles.loginButton]}
            imageStyle={{ borderRadius: 6 }}
          >
            <Text style={{ color: 'white' , fontWeight: 'bold'}}>Connexion</Text>
            </ImageBackground>
            </TouchableOpacity>
            </View>
            <Image
            source={require('../../assets/epitech.webp')}
            style={styles.bottomImage}
          />
          </View>
        </ImageBackground>
    );
} 

export default LoginScreen;

const styles = StyleSheet.create({
    backgroundImage: {
      flex: 1,
      resizeMode: 'cover',
      justifyContent: 'center',
    },
    loginContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: -250,
    },
    passwordInput: {
      width: '80%',
      height: 52,
      marginBottom: 17,
      padding: 8,
      backgroundColor: '#FFF',
      borderColor: 'rgba(114, 11, 11, 0.24)',
      borderWidth: 2,
      borderRadius: 7, 
    },
    input: {
      width: '80%',
      height: 40,
      borderColor: 'yellow',
      borderWidth: 1,
      marginBottom: 25,
      padding: 8,
    },
    loginButton: {
      width: 235,
      height: 52,
      borderRadius: 6,
      borderColor: 'rgba(136, 136, 117, 0.32)',
      elevation: 8,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: 'black',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 2,
    },
    bottomImage: {
      width: '100%',
      height: 42,
      width : 150,
      bottom : -380,
    },
});
  