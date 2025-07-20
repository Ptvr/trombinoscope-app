import React, { createContext, useContext, useState, useEffect } from 'react';
import { Image, Text, View, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Draggable from 'react-native-draggable';
import WeatherComponent from './WeatherComponent';
import TimeComponent from './TimeComponent';
import CalendarComponent from './CalendarComponent';
import TodoComponent from './TodoComponent'
import moment from 'moment';
import Swiper from 'react-native-swiper';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as Animatable from 'react-native-animatable';

const HomeScreen = ({ dataMe, follow, data, setData, setAllProfileImage, setLanding }) => {
  // const { dataMe, follow, data, setData, setAllProfileImage } = route.params;
  const navigation = useNavigation();

  const [photoUrl, setPhotoUrl] = useState('https://imgs.search.brave.com/OPS4JRL8Y-SvauA7-Ny_O4JLQb3o7qFwHhwb72hnqGc/rs:fit:860:0:0/g:ce/aHR0cHM6Ly9jZG4t/aWNvbnMtcG5nLmZs/YXRpY29uLmNvbS81/MTIvNDEvNDE2NjYu/cG5n');
  const [profileImage, setProfileImage] = useState([]);

  const getAccessToken = async () => {
    try {
      const token = await AsyncStorage.getItem('access_token');
      return token;
    } catch (error) {
      console.error('Erreur de récupération de l\'access token:', error);
      return null;
    }
  };

  const [tmpData, setTmpData] = useState([]);
  const [allData, setAllData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentIndex2, setCurrentIndex2] = useState(0);

  const getEmployeesData = async () => {
    const token = await getAccessToken();
    if (token) {
      try {
        const reponse = await fetch('https://masurao.fr/api/employees', {
          method: 'GET',
          headers: {
            'accept': 'application/json',
            'X-Group-Authorization': '67e1f8751d4deb177783d5e5ab9ec276',
            'Authorization': 'Bearer ' + token,
          },
        });
        if (reponse.ok) {
          const employeeData = await reponse.json();
          setTmpData(employeeData);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
      }
    }
  };

  const components = [
    <TodoComponent dataMe={dataMe}/>,
    <WeatherComponent/>,
    <TimeComponent/>,
    <CalendarComponent/>,
  ];

  const renderItem = ({ item }) => {
    return <View>{item}</View>;
  };

  useEffect(() => {
    if (tmpData.length === 0) {
      getEmployeesData();
    }
  }, [tmpData]);

  const getAllData = async (index) => {
    const tmpdata = allData;
    const token = await getAccessToken();
    if (tmpData.length != allData.length) {
      try {
        const reponse = await fetch('https://masurao.fr/api/employees/' + tmpData[index].id, {
          method: 'GET',
          headers: {
            'accept': 'application/json',
            'X-Group-Authorization': '67e1f8751d4deb177783d5e5ab9ec276',
            'Authorization': 'Bearer ' + token,
          },
        });
        if (reponse.ok) {
          const employeeData = await reponse.json();
          tmpdata.push(employeeData);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
      }
    }
    setAllData(tmpdata);
    setCurrentIndex(index + 1);
    console.log("data ok");
  };

  const getProfileImage = async (index) => {
    let tmpProfileImage = profileImage;
    const token = await getAccessToken();
    if (tmpData.length != profileImage.length) {
      try {
        const reponse = await fetch('https://masurao.fr/api/employees/' + tmpData[index].id + '/image', {
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
            tmpProfileImage.push(reader.result);
          };
          reader.readAsDataURL(blob);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des images:', error);
      }
    }
    setProfileImage(tmpProfileImage);
    setAllProfileImage(tmpProfileImage);
    setCurrentIndex2(index + 1);
    console.log('img okk');
  }

  useEffect(() => {
    if (currentIndex < tmpData.length) {
      getAllData(currentIndex);
      setData(allData);
    }
  }, [currentIndex, tmpData]);

  useEffect(() => {
    if (currentIndex2 < tmpData.length) {
      getProfileImage(currentIndex2);
    }
  }, [currentIndex2, tmpData]);

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

  // const handleConv = async (id) => {
  //   try {
  //     await AsyncStorage.setItem('conv', '' + id);
  //   } catch (error) {
  //     console.error('Error setting global variable:', error);
  //   }
  //   navigation.navigate('Chat', { dataMe, follow, allData , allProfileImage: profileImage });
  // }

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/bord.png')}
        style={styles.additionalImage}
      />

      {/* Votre contenu principal */}
      <Image
        source={{ uri: photoUrl }}
        style={styles.image}
        onError={(error) => console.error('Erreur de chargement de l\'image:', error)}
      />
      <View>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'rgba(255,57,86,1)', marginTop: 30, marginLeft: -120, }}>
            Welcome,
          </Text>
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: 'black', marginTop: 30, marginLeft: 3, }}>
            {dataMe?.name} {dataMe?.surname}
          </Text>
         </View>
         <Animatable.View animation="pulse" iterationCount="infinite">
         <TouchableOpacity
            style={styles.button}
            onPress={() => {
              // Naviguer vers l'écran d'accueil après avoir appuyé sur le bouton
              setLanding(true);
            }}
          >
            <Text style={styles.buttonText}>News</Text>
          </TouchableOpacity>
          </Animatable.View>
        {/*<View style={styles.carouselContainer}>
          <FlatList
            horizontal={true}
            data={follow}
            renderItem={({ i, index }) => (
              <TouchableOpacity
              onPress={() => handleConv(data[follow[index] - 1]?.id, data[follow[index] - 1]?.name)}
              >
                 <View style={styles.carouselContainer}> 
                <Image
                source={{ uri: profileImage[follow[index] - 1] }}
                style={styles.carouselImage}
              />
                 Afficher le nom de la personne sous l'image
                <Text style={styles.profileName}>{data[follow[index] - 1]?.name} {data[follow[index] - 1]?.surname}</Text>
               </View>
              </TouchableOpacity>
            )}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={styles.flatListContainer}
          />
        </View> */}
      </View>
      <View style={styles.flatListContainer}>
          <FlatList
            data={components}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
    </View>
  );
}

const Stack = createStackNavigator();

// const HomeScreen = ({ dataMe, follow, data, setData, setAllProfileImage }) => {
//   return (
//     <Stack.Navigator initialRouteName="Message">
//       <Stack.Screen name="Home" component={HomePage} initialParams={{ dataMe, follow, data, setData, setAllProfileImage }} />
//       {/* <Stack.Screen name="Conversation" component={ConvComponent} options={({ route }) => ({ title: route.params.customTitle })}/> */}
//     </Stack.Navigator>
//   );
// };

export default HomeScreen;

const styles = StyleSheet.create({
  item: {
    flex: 1,
    flexDirection: 'row',
  },
  flatListContainer: {
    flex: 1,
    //backgroundColor: 'white',
    flexDirection: 'row',
    marginTop: '10%',
  },
  flatListContentContainer: {
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  wrapper: {},
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  carouselImage: {
    width: 100,
    height: 100,
    marginLeft: 5,
    marginRight: 5,
    borderColor: 'lightgrey',
    backgroundColor: 'lightgrey',
    borderWidth: 2,
    borderRadius: 127,
    marginTop: 10,
    marginBottom: 10,
  },
  image: {
    width: 134,
    height: 134,
    marginLeft: 130,
    borderColor: 'lightgrey',
    borderWidth: 2,
    borderRadius: 127,
    marginTop: 10
  },
  emailText: {
    textAlign: 'center',
    fontSize: 14,
    fontWeight: 'bold',
    color: 'black',
    marginTop: 1,
  },
  additionalImage: {
    width: 480,
    height: 200,
    position: 'absolute',
    marginLeft: -20,
    borderTopRightRadius: 20,
  },
  carouselContainer: {
    backgroundColor: 'rgba( 255, 252, 255, 1 )',
    width: '95%',
    marginTop: '5%',
    marginBottom: '5%',
    marginLeft: '3%',
    borderRadius: 24,
    borderWidth: 3,
    borderColor: 'rgba(255,57,86,0.7)',
    shadowColor: 'rgba(0, 0, 0, 1)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 5,
    // Add elevation for Android
    elevation: 5,
  },

  imageContainer: {
    //backgroundColor: 'black', // Couleur de fond blanche pour chaque image
    width: '100%',
    height: '210%',
    marginTop: '4%',
    marginLeft: '10%',
  },
  imageGroupContainer: {
    flexDirection: 'row', // Affichez les images horizontalement
  },
  button: {
    backgroundColor: 'rgba(255, 57, 86, 0.7)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    width: '23%',
    marginLeft: '70%',
    marginTop: '5%',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});