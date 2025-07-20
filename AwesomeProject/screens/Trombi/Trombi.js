import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ImageBackground, TouchableOpacity, FlatList, TextInput} from 'react-native';
import {
  query,
  where,
  getDocs,
  setDoc,
  doc,
  updateDoc,
  serverTimestamp,
  getDoc,
} from "firebase/firestore";
import { db } from "../../config";

const TrombiScreen = ({dataMe, data, follow, setFollow, allProfileImage}) => {
  const [selectedImageInfo, setSelectedImageInfo] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [filteredData, setFilteredData] = useState(data);

  const handleImageClick = (index) => {
    setSelectedImageInfo(data[index]);
  };

  const handleBack = () => {
    setSelectedImageInfo(null);
  }

  const handleSearch = (text) => {
    setSearchText(text);
    const filtered = data.filter((item) => {
      return (
        item.name.toLowerCase().includes(text.toLowerCase()) ||
        item.surname.toLowerCase().includes(text.toLowerCase()) ||
        item.work.toLowerCase().includes(text.toLowerCase())
      );
    });
    setFilteredData(filtered);
  };

  const handleFollow = async (id) => {
    let newFollow;
    if (follow !== null && follow.indexOf(id) !== -1) {
      newFollow = follow.filter((element) => element !== id);
      setFollow(newFollow);
    } else {
      newFollow = [...follow];
      newFollow.push(id);
      setFollow(newFollow);
    }
    try {
      await AsyncStorage.setItem('follow', JSON.stringify(newFollow));
    } catch (error) {
      console.error('Erreur de stockage de l\'access token:', error);
    }
  }

  const isFollowed = (id) => {
    if (follow !== null && follow.indexOf(id) !== -1)
      return true;
    return false;
  }

  // const handleMessage = async (currentUser) => {
  //   const combinedId = dataMe.id < currentUser.id ? dataMe.id + '_' + currentUser.id : currentUser.id + '_' + dataMe.id;
  //   try {
  //     const res = await getDoc(doc(db, "chats", combinedId));

  //     if (!res.exists()) {
  //       //create a chat in chats collection
  //       await setDoc(doc(db, "chats", combinedId), { messages: [] });

  //       //create user chats
  //       await updateDoc(doc(db, "userChats", '' + currentUser.id), {
  //         [combinedId + ".userInfo"]: {
  //           id: dataMe.id,
  //           displayName: dataMe.name,
  //         },
  //         [combinedId + ".date"]: serverTimestamp(),
  //       });

  //       await updateDoc(doc(db, "userChats", '' + dataMe.id), {
  //         [combinedId + ".userInfo"]: {
  //           id: currentUser.id,
  //           displayName: currentUser.name,
  //         },
  //         [combinedId + ".date"]: serverTimestamp(),
  //       });
  //       handleBack();
  //       // navigate to the message
  //     } else {
  //       handleBack();
  //       // navigate to message
  //     }
  //   } catch (err) {
  //     console.log(err);
  //   }
  // }

  return (
<View style={styles.container}>
      <ImageBackground
      source={require('../../assets/searchback.png')}
      style={styles.searchContainer}
    >
        </ImageBackground>
      {selectedImageInfo ? (
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Image
            source={require('../../assets/backtrombi.png')}
            style={styles.backButtonImage}
          />
          </TouchableOpacity> ) : <Text></Text>}
      {selectedImageInfo ? (
  <View style={styles.selectedImageInfo}>
    <TouchableOpacity
     onPress={handleBack}>
      <Text>Back</Text>
    </TouchableOpacity>
            <Image
            source={require('../../assets/bord.png')}
            style={styles.additionalImage}
          />
    <Image
      source={{ uri: allProfileImage[selectedImageInfo.id - 1] }}
      style={[styles.selectedImage, { backgroundColor: 'lightgrey' }]}
      onError={(error) => console.error('Erreur de chargement de l\'image:', error)}
    />
    <Text style={{ textAlign: 'center', fontSize: 20, fontWeight: 'bold', color: 'black', marginLeft: -220, marginTop: 28}}>{selectedImageInfo.name} {selectedImageInfo.surname}</Text>
    <Text style={styles.emailText}>{selectedImageInfo.email}</Text>
    <Text style={styles.emailText}>{(selectedImageInfo) ? selectedImageInfo.work : ''}</Text>
    {/* Ajoutez d'autres informations ici */}
      <View style={styles.followButton}>
      <TouchableOpacity
     onPress={() => handleFollow(selectedImageInfo.id)}>
            <ImageBackground
            source={require('../../assets/button.png')}
            style={[styles.followButton]}
            imageStyle={{ borderRadius: 6 }}
          >
            <Text style={{ textAlign: 'center', color: 'white' , fontWeight: 'bold'}}>{isFollowed(selectedImageInfo.id) ? 'Unfollow' : 'Follow'} {selectedImageInfo.name}</Text>
            </ImageBackground>
            </TouchableOpacity>
            </View>
  </View>
) : (
  <Text></Text>
)}
    <View>
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name or surname"
            onChangeText={handleSearch}
            value={searchText}
          />
        </View>
      <FlatList
        data={filteredData}
        numColumns={3}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            onPress={() => handleImageClick(item.id - 1)}
          >
            <View style={styles.profileImageContainer}>
              <Image
                source={{ uri: allProfileImage[item.id - 1] }}
                style={styles.profileImage}
              />
              {/* Afficher le nom de la personne sous l'image */}
              <Text style={styles.profileName}>{item.name} {item.surname}</Text>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.flatListContainer}
      />
    </View>
  );
}

export default TrombiScreen;

const styles = StyleSheet.create({
  profileImageContainer: {
    alignItems: 'center',
    marginBottom: 8,
  },
  flatListContainer: {
    padding: 8,
  },
  imageContainer: {
    position: 'relative',
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
  },
  profileImage: {
    width: 100,
    height: 100,
    marginRight: 18,
    marginBottom: 20,
    borderRadius: 50,
    backgroundColor: 'lightgrey',
  },
  profileName: {
    textAlign: 'center',
    fontSize: 12,
    color: 'black',
    marginLeft: -15,
    marginTop: -15,
    marginBottom: 10,
  },
  flatListContainer: {
    padding: 24,
  },
  selectedImageInfo: {
    backgroundColor: 'white',
    padding: 300,
    marginTop: 0,
  },
  imageIndex: {
    fontSize: 16,
  },
  selectedImage: {
    width: 134,
    height: 134,
    borderColor: 'lightgrey',
    borderWidth: 2,
    marginLeft: -170,
    marginTop: -310,
    borderRadius: 127,
  },
  selectedImageMore: {
    backgroundColor: 'white',
  },
  emailText: {
    textAlign: 'center',
    fontSize: 14,
    fontWeight: 'bold',
    color: 'black',
    marginTop: 10,
    marginLeft: -235,
  },
  additionalImage: {
    width: 480,
    height: 300,
    position: 'absolute',
    marginTop: 0,
    borderTopRightRadius: 20,
  },
  followButton: {
    width: 265,
    height: 52,
    borderRadius: 6,
    borderColor: 'rgba(136, 136, 117, 0.32)',
    marginTop: '80%',
    marginLeft: -115,
    justifyContent: 'center',
  },
  messageButton: {
    width: 265,
    height: 52,
    backgroundColor: 'white',
    borderColor: 'black',
    borderWidth: 2,
    borderRadius: 6,
    elevation: 8,
    marginTop: 35,
    marginLeft: -230,
    justifyContent: 'center',
  },
  bottomLine: {
    height: 1,
    backgroundColor: 'gray',
    marginTop: 150,
    marginBottom: 0,
  },
  backButtonImage: {
    marginTop: 40,
    marginLeft: 20,
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  searchInput: {
    marginLeft: 20,
    width: 343,
    height: 52,
    borderColor: 'black',
    borderWidth: 2,
    borderRadius: 3,
    backgroundColor: 'white',
    paddingHorizontal: 10,
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  searchContainer: {
    width: 250,
    height: 80,
   //backgroundColor: 'lightgrey',
    padding: 0,
  },
});