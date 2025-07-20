import React, { useState, useEffect } from 'react';
import { TouchableOpacity, Text, View, StyleSheet, TextInput, Image, FlatList, Platform, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { db } from "../../config";
import { arrayUnion, doc, onSnapshot, serverTimestamp, Timestamp, updateDoc, setDoc, getDoc } from "firebase/firestore";
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { useNavigation, useRoute } from '@react-navigation/native';
import 'react-native-get-random-values';
import { v4 as uuid } from "uuid";
import { KeyboardAvoidingView } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { KeyboardAwareView } from 'react-native-keyboard-aware-view';

const ConvComponent = ({ route }) => {
  const { dataMe, hisId, combinedId, customTitle } = route.params;
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  

  useEffect(() => {
    const unSub = onSnapshot(doc(db, "chats", combinedId), (doc) => {
      doc.exists() && setMessages(doc.data().messages);
    });

    return () => {
      unSub();
    };
  }, [combinedId]);

  const handleTextSubmit = async () => {
    // Handle the text input when the "Enter" key is pressed
    
    if (text) {
      await updateDoc(doc(db, "chats", combinedId), {
        messages: arrayUnion({
          id: uuid(),
          text,
          senderId: dataMe.id,
          date: Timestamp.now(),
        }),
      });
      await updateDoc(doc(db, "userChats", '' + dataMe.id), {
        [combinedId + ".lastMessage"]: {
          text,
        },
        [combinedId + ".date"]: serverTimestamp(),
      });
      await updateDoc(doc(db, "userChats", '' + hisId), {
        [combinedId + ".lastMessage"]: {
          text,
        },
        [combinedId+ ".date"]: serverTimestamp(),
      });
    }

    setText('')

    // You can perform any actions or submit the text here
  };



  return (
    <KeyboardAwareScrollView
      style={{ flex: 1 }}
      contentContainerStyle={styles.bigBulle}
      resetScrollToCoords={{ x: 0, y: 0 }}
      scrollEnabled={true}
    >
          <KeyboardAwareView animated={true}>
<View style={styles.bigBulle}>
  <FlatList
    data={messages}
    contentContainerStyle={{ paddingTop: 10 }}
    keyExtractor={(item) => item.id}
    renderItem={({ item }) => (
      <View
        style={[
          styles.chatBox,
          {
            alignSelf:
              item.senderId === dataMe.id ? 'flex-end' : 'flex-start',
              backgroundColor:
                item.senderId === dataMe.id ? '#e17f8a' : '#EFEFEF', // Couleur de fond du message
              width: '40%',
              height: '30%',
              marginRight: '5%',
              maxHeightHeight: '23%', // Hauteur maximale
              overflowY: 'scroll', // Activation du défilement vertical
              flexDirection: 'row',
              flex: 1,
          },
        ]}
      >
        {/* <Image
          source={{
            uri: item.senderId === dataMe.id
              ? dataMe.avatar // Votre avatar
              : hisAvatar, // L'avatar de l'autre personne
          }}
          style={styles.userAvatar}
        /> */}
        <View
          style={[
            styles.messageContainer,
            {
              
            },
          ]}
        >
          <Text style={styles.messageText}>{item.text}</Text>
        </View>
      </View>
    )}
  />
 <View style={styles.inputContainer}>
        <TextInput
          style={styles.inputField}
          placeholder="Message..."
          onChangeText={(text) => setText(text)}
          value={text}
          placeholderTextColor="#777"
          onSubmitEditing={handleTextSubmit}
        />
        <TouchableOpacity
          style={styles.sendButton}
          onPress={handleTextSubmit}
        >
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cameraButton}>
        </TouchableOpacity>
      </View>
</View>
</KeyboardAwareView>
</KeyboardAwareScrollView>


    )
};

const Message = ({ route }) => {
  const navigation = useNavigation();

  const { dataMe, follow, allData, allProfileImage } = route.params;
  const [chats, setChats] = useState([]);
  const [fol, setFollow] = useState(follow);

  useEffect(() => {
    const getChats = () => {
      const unsub = onSnapshot(doc(db, "userChats", '' + dataMe.id), (doc) => {
        const chatsArray = Object.values(doc.data());
        setChats(chatsArray);
      });

      return () => {
        unsub();
      };
    };

    getChats();
  }, []);

  useEffect(() => {
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

    getFollow();
  }, []);

  const handleConv = async (id, name) => {
    const combinedId = dataMe.id < id ? dataMe.id + '_' + id : id + '_' + dataMe.id;
    // create if not created
    try {
      const res = await getDoc(doc(db, "chats", combinedId));

      if (!res.exists()) {
        //create a chat in chats collection
        await setDoc(doc(db, "chats", combinedId), { messages: [] });

        //create user chats
        await updateDoc(doc(db, "userChats", '' + id), {
          [combinedId + ".userInfo"]: {
            id: dataMe.id,
            displayName: dataMe.name,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });

        await updateDoc(doc(db, "userChats", '' + dataMe.id), {
          [combinedId + ".userInfo"]: {
            id: id,
            displayName: name,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });
        navigation.navigate('Conversation', { dataMe, hisId: id, combinedId, customTitle: name });
      } else {
        navigation.navigate('Conversation', { dataMe, hisId: id, combinedId, customTitle: name });
      }
    } catch (err) {
      console.log(err);
    }
  }
  console.log(fol);
  return (
    <View style={styles.container}>
      <View style={styles.carouselContainer}>

          <FlatList
            horizontal={true}
            data={follow}
            renderItem={({ i, index }) => (
              <TouchableOpacity
              onPress={() => handleConv(allData[fol[index] - 1]?.id, allData[fol[index] - 1]?.name)}
              >
                 <View> 
                  <Image
                    source={{ uri: allProfileImage[fol[index] - 1] }}
                    style={styles.carouselImage}
                  /> 
                   <Text style={[styles.profileName, { fontWeight: 'bold' }]}>
          {allData[fol[index] - 1]?.name} {allData[fol[index] - 1]?.surname}
        </Text>
                </View>
              </TouchableOpacity>
            )}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={styles.flatListContainer}
          />
        </View>
      <TextInput
        style={styles.searchInput}
        placeholder="Search ..."
        // onChangeText={(heading) => setAddData(heading)}
        // value={addData}
      />
      <FlatList
        data={chats}
        numColumns={1}
        renderItem={({ item, index }) => (
          <TouchableOpacity onPress={() => handleConv(item.userInfo.id, item.userInfo.displayName)}>
            <View style={styles.chatBox}>
            <Image
              source={{ uri: allProfileImage[item.userInfo.id - 1] }}
              style={styles.selectedImage}
              onError={(error) => console.error('Erreur de chargement de l\'image:', error)}
            />
            <View style={styles.chatInfo}>
              <Text style={styles.displayName}>{item.userInfo.displayName}</Text>
              <Text style={styles.lastMessage}>{item.lastMessage?.text}</Text>
            </View>
          </View>
        </TouchableOpacity>
      )}
      />

    </View>
  );
};

const Stack = createStackNavigator();

const MessScreen = ({dataMe, follow, allData, allProfileImage}) => {
  return (
    // <NavigationContainer>
      <Stack.Navigator initialRouteName="Message">
        <Stack.Screen name="Message" component={Message} initialParams={{ dataMe, follow, allData, allProfileImage }} />
        <Stack.Screen name="Conversation" component={ConvComponent} options={({ route }) => ({ title: route.params.customTitle })}/>
      </Stack.Navigator>
    // </NavigationContainer>
  );
};

export default MessScreen;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'column',
      // justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      height : '100%',
      backgroundColor: 'white',
    },
    searchInput: {
      marginLeft: 10,
      width: 343,
      height: 52,
      borderColor: 'black',
      borderWidth: 2,
      borderRadius: 3,
      backgroundColor: 'white',
      paddingHorizontal: 10,
    },
    selectedImage: {
      width: 134,
      height: 134,
      borderColor: 'lightgrey',
      borderWidth: 2,
      borderRadius: 127,
      backgroundColor: 'lightgrey'
    },
    chatBox: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'white', // Fond blanc autour de chaque chat box
      marginLeft: '5%',
      marginBottom: 5, // Marge inférieure entre les boîtes de chat
      padding: 5, // Rembourrage interne pour séparer les éléments
      borderRadius: 10, // Coins arrondis pour la boîte de chat
      width: 343,
      height: 82,
      //alignSelf: 'center', // Centrer la boîte de chat horizontalement
      shadowColor: 'rgba(0, 0, 0, 0.1)', // Ombre légère
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.5,
      shadowRadius: 4,
      elevation: 5,
      borderBottomWidth: 0.2, // Bordure inférieure
      borderBottomColor: 'lightgray', // Couleur de la bordure inférieure
    },
    selectedImage: {
      width: 60,
      height: 60,
      borderRadius: 30,
      marginRight: 10,
    },
    chatInfo: {
      flex: 1,
    },
    displayName: {
      fontSize: 16,
      fontWeight: 'bold',
    },
    lastMessage: {
      fontSize: 14,
      color: 'gray',
    },
    messageList: {
      flexGrow: 1,
    },
    emptyMessage: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      fontSize: 16,
      color: '#777',
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 10,
      paddingVertical: 5,
      backgroundColor: 'white',
      borderTopWidth: 1,
      borderTopColor: '#ddd',
      position: 'absolute',
      marginTop: '149%',
    },
    inputField: {
      flex: 1,
      paddingVertical: 8,
      paddingHorizontal: 16,
      backgroundColor: '#f1f1f1',
      borderRadius: 25,
      marginRight: 10,
      fontSize: 16,
    },
    sendButton: {
      backgroundColor: '#e17f8a',
      borderRadius: 25,
      paddingVertical: 10,
      paddingHorizontal: 20,
    },
    sendButtonText: {
      color: 'white',
      fontWeight: 'bold',
      fontSize: 16,
    },
    bigBulle: {
      backgroundColor: 'white',
      height: '100%',
    },
    carouselContainer: {
      width: '95%',
      marginTop: '5%',
      marginBottom: '5%',
      marginLeft: '3%',
      borderRadius: 24,
      borderColor: 'rgba(255,57,86,0.7)',
      shadowColor: 'rgba(0, 0, 0, 1)',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 1,
      shadowRadius: 0,
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
});