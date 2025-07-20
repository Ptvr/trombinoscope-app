import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Calendar } from 'react-native-calendars';
import moment from 'moment';

const CalendarComponent = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [bigScreenStatus, setBigScreenStatus] = useState(false);
  const currentDate = moment().format('DD/MM/YYYY');

  const onDayPress = (day) => {
    setSelectedDate(moment(day.dateString).format('DD/MM/YYYY'));
  };

  const onMonthChange = (month) => {
    const today = new Date();
    if (month.year === today.getFullYear() && month.month === today.getMonth() + 1) {
      setSelectedDate(moment(today).format('DD/MM/YYYY'));
    } else {
      setSelectedDate(null);
    }
  };

  const bigScreen = () => {
    setBigScreenStatus(true);
  }

  const littleScreen = () => {
    setBigScreenStatus(false);
  }

  const renderHeader = (date) => {
    const monthNames = [
      'Janvier',
      'Février',
      'Mars',
      'Avril',
      'Mai',
      'Juin',
      'Juillet',
      'Août',
      'Septembre',
      'Octobre',
      'Novembre',
      'Décembre',
    ];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    return (
      <View style={styles.header}>
        <Text style={styles.headerText}>{month} {year}</Text>
      </View>
    );
  };

  const renderDay = (day, selected) => {
    const dayOfWeek = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
    const today = new Date();
    const isToday =
      day.dateString ===
      today.getFullYear() +
        '-' +
        (today.getMonth() + 1).toString().padStart(2, '0') +
        '-' +
        today.getDate().toString().padStart(2, '0');
    return (
      <View style={[styles.day, selected && styles.selectedDay]}>
        <Text style={[styles.dayText, isToday && styles.todayText]}>
          {dayOfWeek[new Date(day.dateString).getDay()]}
        </Text>
        <Text style={[styles.dayText, selected && styles.selectedDayText]}>
          {day.day}
        </Text>
      </View>
    );
  };

  const renderArrow = (direction) => {
    const icon = direction === 'left' ? 'ios-arrow-back' : 'ios-arrow-forward';
    return (
      <Ionicons
        name={icon}
        size={24}
        color="black"
        style={styles.arrow}
      />
    );
  };

  return (
    bigScreenStatus ?
    (<View style={styles.bigBulle}>
      <TouchableOpacity style={styles.xxx} onPress={littleScreen}>
        <View>
            <Text style={styles.BackButton}>Back</Text>
        </View>
      </TouchableOpacity>
        <View style={[styles.container, {width: 200, height: 200}]}>
        <Calendar
          onDayPress={onDayPress}
          onMonthChange={onMonthChange}
          markedDates={{ [selectedDate]: { selected: true } }}
          renderHeader={renderHeader}
          renderDay={renderDay}
          renderArrow={renderArrow}
          theme={{
            backgroundColor: 'white',
            calendarBackground: 'white',
            textSectionTitleColor: 'black',
            selectedDayBackgroundColor: 'lightblue',
            selectedDayTextColor: 'black',
            todayTextColor: 'black',
            dayTextColor: 'black',
            textDisabledColor: 'gray',
            dotColor: 'black',
            selectedDotColor: 'black',
            arrowColor: 'black',
            monthTextColor: 'black',
            indicatorColor: 'black',
            textDayFontWeight: 'bold',
            textMonthFontWeight: 'bold',
            textDayHeaderFontWeight: 'bold',
            textDayFontSize: 16,
            textMonthFontSize: 16,
            textDayHeaderFontSize: 16,
          }}
        />
        {selectedDate && (
          <View style={styles.selectedDateContainer}>
            <Text style={styles.selectedDateTitle}>selected date :</Text>
            <Text style={styles.selectedDateText}>{selectedDate}</Text>
          </View>
        )}
        <Text style={styles.currentDateTitle}>current date :</Text>
        <Text style={styles.currentDateText}>{currentDate}</Text>
      </View>
    </View>) :
    (<View style={styles.bulle}>
        <TouchableOpacity style={styles.xxx} onPress={bigScreen}>
          <View>
            <Ionicons name="ios-calendar" size={40} color="black" />
          </View>
        </TouchableOpacity>
    </View>)
    );
}

export default CalendarComponent;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'blue',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  headerText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  day: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: 'black',
  },
  selectedDay: {
    backgroundColor: 'lightblue',
  },
  selectedDayText: {
    color: 'black',
  },
  todayText: {
    color: 'red',
  },
  arrow: {
    marginHorizontal: 10,
  },
  selectedDateContainer: {
    marginTop: 20,
  },
  bulle: {
    width: 75,
    height: 75,
    borderRadius: 50,
    marginTop: '20%',
    marginLeft: '40%',
    backgroundColor: 'pink',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bigBulle: {
    width: 350,
    height: 500,
    borderRadius: 50,
    marginTop: '5%',
    marginLeft: '5%',
    backgroundColor: 'pink',
    alignItems: 'center',
  },
  BackButton: {
    textAlign: 'right',
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    marginTop: 1,
    marginBottom: 130,
  },
  selectedDateTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    marginTop: -10,
  },
  selectedDateText: {
    fontSize: 14,
    textAlign: 'center',
  },
  currentDateTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 5,
  },
  currentDateText: {
    fontSize: 14,
    marginTop: 2,
    textAlign: 'center',
  },
});