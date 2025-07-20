import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet, ImageBackground, Image } from 'react-native';
import * as Animatable from 'react-native-animatable';
import Icon from 'react-native-vector-icons/FontAwesome5';

const LandingScreen = ({ setLanding }) => {
  return (
    <ImageBackground
      source={require('../../assets/landingpage.png')}
      style={styles.backgroundImage}
    >
      <View style={styles.container}>
        <View style={styles.eventContainer}>
          <View style={styles.eventHeader}>
          <Text style={styles.eventHeaderText}>
  <Icon name="calendar-alt" size={18} color="black" style={styles.fontAwesomeIcon} /> Événement Actuel
</Text>
          </View>
          <View style={styles.eventContent}>
            <Text style={styles.eventTitle}>Nom de l'événement fictif</Text>
            <Text style={styles.eventDescription}>
              Description de l'événement actuel fictif. Cet événement est en cours et présente des détails intéressants.
            </Text>
          </View>
        </View>
        <View style={styles.milestoneContainer}>
          <View style={styles.milestoneHeader}>
          <Text style={styles.milestoneHeaderText}>
  Milestone du Projet <Icon name="flag" size={18} color="black" style={styles.fontAwesomeIcon} />
</Text>
          </View>
          <View style={styles.milestoneContent}>
            <Text style={styles.milestoneTitle}>Milestone Fictive</Text>
            <Text style={styles.milestoneDescription}>
              Description de la milestone fictive. Cette étape est cruciale pour le projet factice et présente des détails importants.
            </Text>
          </View>
        </View>

        <View style={styles.newcomerContainer}>
          <View style={styles.newcomerHeader}>
            <Text style={styles.newcomerHeaderText}>Dernier Arrivant  <Icon name="user" size={18} color="black" /></Text>
          </View>
          <View style={styles.newcomerContent}>
            <Image
              source={{ uri: 'URL_DE_LA_PHOTO_DU_DERNIER_ARRIVANT' }}
              style={styles.newcomerImage}
            />
            <Text style={styles.newcomerName}>Nom du dernier arrivant fictif</Text>
          </View>
        </View>

        <Text style={styles.additionalInfo}>
          Individuellement, nous sommes une goutte d'eau. Ensemble, nous sommes un océan.
        </Text>
        <Animatable.View animation="pulse" iterationCount="infinite">
  <TouchableOpacity
    style={styles.button}
    onPress={() => {
      // Naviguer vers l'écran d'accueil après avoir appuyé sur le bouton
      setLanding(false);
    }}
  >
    <Text style={styles.buttonText}>Commencer</Text>
  </TouchableOpacity>
</Animatable.View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    alignItems: 'center',
    justifyContent: 'center',
  },
  eventContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    width : '90%',
  },
  eventHeader: {
    borderBottomWidth: 1,
    borderColor: 'gray',
    paddingBottom: 10,
    marginBottom: 10,
  },
  eventHeaderText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  eventContent: {},
  eventTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  eventDescription: {
    fontSize: 14,
  },
  milestoneContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    width: '98%',
  },
  milestoneHeader: {
    borderBottomWidth: 1,
    borderColor: 'gray',
    paddingBottom: 10,
    marginBottom: 10,
  },
  milestoneHeaderText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  milestoneContent: {},
  milestoneTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  newcomerContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  newcomerHeader: {
    borderBottomWidth: 1,
    borderColor: 'gray',
    paddingBottom: 10,
    marginBottom: 10,
  },
  newcomerHeaderText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  newcomerContent: {
    alignItems: 'center',
  },
  newcomerImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  newcomerName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  milestoneDescription: {
    fontSize: 14,
  },
  additionalInfo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
    marginLeft: '4%',
  },
  button: {
    backgroundColor: 'rgba(255, 57, 86, 0.7)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  fontAwesomeIcon: {
    fontFamily: 'Font Awesome 5 Free', // Nom de la police d'écriture Font Awesome 5
  },
});

export default LandingScreen;