import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const WeatherComponent = () => {
  const [bigScreenStatus, setBigScreenStatus] = useState(false);
  const [weatherData, setWeatherData] = useState([]);
  const [weatherStatus, setWeatherStatus] = useState(false);

  const getAccessToken = async () => {
    try {
      const token = await AsyncStorage.getItem('access_token');
      return token;
    } catch (error) {
      console.error('Erreur de récupération de l\'access token:', error);
      return null;
    }
  };

  const getWeatherData = async () => {
    const token = await getAccessToken();
    if (token) {
      try {
        const reponse = await fetch('https://api.weatherapi.com/v1/current.json?key=9846838193104e16811180049230709&q=Nice&aqi=yes');
        if (reponse.ok) {
          const data = await reponse.json();
          setWeatherData(data);
          console.log('WeatherData ok');
          console.log(data);
          setWeatherStatus(true);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
      }
    }
  }

  const bigScreen = () => {
    setBigScreenStatus(true);
  }

  const littleScreen = () => {
    setBigScreenStatus(false);
  }

  useEffect(() => {
    if (weatherData.length === 0) {
      getWeatherData();
    }
  }, [weatherData]);

  return (
    bigScreenStatus ?
    (<View style={styles.bigBulle}>
      <TouchableOpacity style={styles.xxx} onPress={littleScreen}>
        <Text style={styles.BackButton}>Back</Text>
      </TouchableOpacity>
      <Image
            source={{ uri: 'https://' + weatherData.current.condition.icon }}
            style={styles.weatherIconBig}/>
      <Text style={styles.WidgetTextcelcius}>{weatherData.current.temp_c}°C</Text>
      <Text style={styles.WidgetTextcity}>{weatherData.location.name}</Text>
    </View>) :
    (<View style={styles.bulle}>
      {weatherStatus ? (
        <TouchableOpacity style={styles.xxx} onPress={bigScreen}>
          <View>
            <Image
            source={{ uri: 'https://' + weatherData.current.condition.icon }}
            style={styles.weatherIcon}/>
            <Text style={styles.weatherbulle}>{weatherData.current.temp_c}°C</Text>
          </View>
        </TouchableOpacity>) :
        <Text></Text>}
    </View>)
  );
}

export default WeatherComponent;

const styles = StyleSheet.create({
    bulle: {
      width: 75,
      height: 75,
      borderRadius: 50,
      backgroundColor: `pink`,
      marginLeft: '18%',
      marginTop: '14%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    bigBulle: {
      width: 200,
      height: 200,
      borderRadius: 50,
      backgroundColor: 'pink',
      alignItems: 'center',
      marginTop: '6%',
      marginLeft:'4%',
    },
    BackButton: {
      textAlign: 'right',
      fontSize: 20,
      fontWeight: 'bold',
      color: 'black',
      marginTop: 1,
    },
    weatherbulle: {
      marginTop: -12,
      marginLeft: 18,
      fontWeight: 'bold',
      fontSize: 12,
    },
    weatherIconBig: {
      width: 120,
      height: 120,
      marginLeft: -78,
    },
    weatherIcon: {
      width: 68,
      height: 68,
    },
    WidgetTextcelcius: {
      textAlign: 'center',
      fontSize: 25,
      color: 'black',
      marginTop: -50,
      marginLeft: 100,
    },
    WidgetTextcity: {
      textAlign: 'center',
      fontSize: 40,
      fontWeight: 'bold',
      color: 'black',
      marginTop: 20,
      marginLeft: -10,
    },
  });