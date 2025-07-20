import React, { useState, useEffect } from 'react';
import { TouchableOpacity, Text, View, StyleSheet, ImageBackground, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SettingsScreen = ({dataMe, updateLoginStatus}) => {

  const [photoUrl, setPhotoUrl] = useState('https://imgs.search.brave.com/OPS4JRL8Y-SvauA7-Ny_O4JLQb3o7qFwHhwb72hnqGc/rs:fit:860:0:0/g:ce/aHR0cHM6Ly9jZG4t/aWNvbnMtcG5nLmZs/YXRpY29uLmNvbS81/MTIvNDEvNDE2NjYu/cG5n');

  const removeAccessToken = async () => {
    try {
      await AsyncStorage.removeItem('access_token');
      updateLoginStatus(false);
      console.log('Token supprimé avec succès');
    } catch (error) {
      console.error('Erreur lors de la suppression du token:', error);
    }
  };

  const getAccessToken = async () => {
    try {
      const token = await AsyncStorage.getItem('access_token');
      return token;
    } catch (error) {
      console.error('Erreur de récupération de l\'access token:', error);
      return null;
    }
  };

  const getProfileImageMe = async (id) => {
    const token = await getAccessToken();
    try {
      const reponse = await fetch('https://masurao.fr/api/employees/' + id + '/image', {
        method: 'GET',
        headers: {
          'accept': 'image/png',
          'X-Group-Authorization': '67e1f8751d4deb177783d5e5ab9ec276',
          'Authorization': 'Bearer ' + token,
        },
      });
      if (reponse.ok) {
        const blob = await reponse.blob();
        const reader = new FileReader();
        reader.onload = () => {
          setPhotoUrl(reader.result);
        };
        reader.readAsDataURL(blob);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des images:', error);
    }
  };


  useEffect(() => {
    getProfileImageMe(dataMe?.id);
  }, [photoUrl]);

  return (
    <View style={styles.container}>
  <Image
            source={require('../../assets/bord.png')}
            style={styles.additionalImage}
          />
      <Image
        source={{ uri: photoUrl }}
        style={styles.image}
        onError={(error) => console.error('Erreur de chargement de l\'image:', error)}
      />
    <Text style={{ textAlign: 'center', fontSize: 20, fontWeight: 'bold', color: 'black', marginTop: "7%"}}>{dataMe.name} {dataMe.surname}</Text>
    <Text style={styles.emailText}>{dataMe.email}</Text>
    <Text style={styles.emailText}>{dataMe.work}</Text>
    <Text style={styles.emailText}>{dataMe.birth_date}</Text>
    <Text style={styles.emailText}>{dataMe.gender}</Text>

      <TouchableOpacity
        style={styles.loginButton}
        onPress={removeAccessToken}
      >
      <ImageBackground
        source={require('../../assets/button.png')}
        style={[styles.loginButton]}
        imageStyle={{ borderRadius: 6 }}
        >
        <Text style={{ color: 'white' , fontWeight: 'bold'}}>Logout</Text>
      </ImageBackground>
    </TouchableOpacity>
    </View>
  );
}

export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba( 255, 252, 255, 1 )',
  },
  additionalImage: {
    width: 480,
    height: 400,
    position: 'absolute',
    marginTop: 0,
    marginLeft: -20,
    borderTopRightRadius: 20,
  },
  loginButton: {
    width: 235,
    height: 52,
    marginTop: '59%',
    marginLeft: '16%',
    borderColor: 'rgba(136, 136, 117, 0.32)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emailText: {
    textAlign: 'center',
    fontSize: 15,
    fontWeight: 'bold',
    color: 'black',
    marginTop: 1,
  },
  image: {
    width: 130,
    height: 130,
    marginLeft: 130,
    borderColor: 'lightgrey',
    borderWidth: 2,
    borderRadius: 127,
    marginTop: 10
  },
})