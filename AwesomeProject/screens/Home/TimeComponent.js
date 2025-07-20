import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ScrollView } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

const TimeComponent = () => {
  const [bigScreenStatus, setBigScreenStatus] = useState(false);
  const [time, setTime] = useState(null);
  const [newYorkTime, setNewYorkTime] = useState(null);
  // const [tokyoTime, setTokyoTime] = useState(null);
  // const [londonTime, setLondonTime] = useState(null);
  // const [sydneyTime, setSydneyTime] = useState(null);
  // const [losAngelesTime, setLosAngelesTime] = useState(null);

  setInterval(() => {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    setTime(`${hours}:${minutes}:${seconds}`);

    const newYorkTime = now.toLocaleTimeString('en-US', { timeZone: 'America/New_York' });
    setNewYorkTime(newYorkTime);

    // const tokyoTime = now.toLocaleTimeString('en-US', { timeZone: 'Asia/Tokyo' });
    // setTokyoTime(tokyoTime);

    // const londonTime = now.toLocaleTimeString('en-US', { timeZone: 'Europe/London' });
    // setLondonTime(londonTime);

    // const sydneyTime = now.toLocaleTimeString('en-US', { timeZone: 'Australia/Sydney' });
    // setSydneyTime(sydneyTime);

    // const losAngelesTime = now.toLocaleTimeString('en-US', { timeZone: 'America/Los_Angeles' });
    // setLosAngelesTime(losAngelesTime);
  }, 1000);

  const bigScreen = () => {
    setBigScreenStatus(true);
  };

  const littleScreen = () => {
    setBigScreenStatus(false);
  };

  return bigScreenStatus ? (
    <View style={styles.bigBulle}>
      <TouchableOpacity style={styles.xxx} onPress={littleScreen}>
        <View>
          <Text style={styles.BackButton}>Back</Text>
        </View>
      </TouchableOpacity>
      <FontAwesome5 name="clock" style={styles.timeIcon} size={40} color="black"/>
      <View style={styles.slideContainer}>
        <ScrollView horizontal={true} pagingEnabled={true}>
          <View style={styles.slide}>
            <Text style={styles.text}>Paris time:</Text>
            <Text style={styles.text}>{time}</Text>
          </View>
          <View style={styles.slide}>
            <Text style={styles.text}>New York time:</Text>
            <Text style={styles.text}>{newYorkTime}</Text>
          </View>
          {/* <View style={styles.slide}>
            <Text style={styles.text}>Tokyo time:</Text>
            <Text style={styles.text}>{tokyoTime}</Text>
          </View>
          <View style={styles.slide}>
            <Text style={styles.text}>London time:</Text>
            <Text style={styles.text}>{londonTime}</Text>
          </View>
          <View style={styles.slide}>
            <Text style={styles.text}>Sydney time:</Text>
            <Text style={styles.text}>{sydneyTime}</Text>
          </View>
          <View style={styles.slide}>
            <Text style={styles.text}>Los Angeles time:</Text>
            <Text style={styles.text}>{losAngelesTime}</Text>
          </View> */}
        </ScrollView>
      </View>
    </View>
  ) : (
    <View style={styles.bulle}>
      <TouchableOpacity style={styles.xxx} onPress={bigScreen}>
        <View>
        <FontAwesome5 name="clock" style={styles.timeIcon} size={40} color="black" />
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default TimeComponent;

const styles = StyleSheet.create({
  bulle: {
    width: 75,
    height: 75,
    borderRadius: 50,
    backgroundColor: 'pink',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: '65%',
    marginTop: '-17%',
  },
  bigBulle: {
    width: 200,
    height: 200,
    borderRadius: 50,
    backgroundColor: 'pink',
    alignItems: 'center',
    marginTop: '6%',
    marginLeft: '45%',
  },
  BackButton: {
    textAlign: 'right',
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    marginTop: 1,
  },
  timeIcon: {
    marginTop: '15%',
    alignContent: 'center',
  },
  weatherbulle: {
    marginTop: -12,
    marginLeft: 18,
  },
  slide: {
    width: 200,
    justifyContent: 'top',
    alignItems: 'center',
  },
  text: {
    fontSize: 19,
    fontWeight: 'bold',
    color: 'black',
  },
  slideContainer: {
    backgroundColor: 'rgba(255, 231, 248, 0.3)',
    height: "30%",
    borderRadius: 20,
    marginTop: '13%'
  },
});