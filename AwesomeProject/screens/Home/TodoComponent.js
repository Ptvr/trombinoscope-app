import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { arrayUnion, doc, onSnapshot, serverTimestamp, Timestamp, updateDoc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../../config";
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import CheckBox from 'react-native-checkbox';


const TodoComponent = ( { dataMe } ) => {
    const [bigScreenStatus, setBigScreenStatus] = useState(false);
    const [number, setNumber] = useState(0);
    const [todo, setTodo] = useState([]);
    const [text, setText] = useState('');

    useEffect(() => {
        const getTodo = async () => {
          try {
            const res = await getDoc(doc(db, "todo", '' + dataMe.id));
            if (!res.exists())
              await setDoc(doc(db, "todo", '' + dataMe.id), { todo: [] });
          } catch (err) {
            console.log(err);
          }
          const unsub = onSnapshot(doc(db, "todo", '' + dataMe.id), (doc) => {
            const todoArray = Object.values(doc.data().todo);
            setTodo(todoArray);
            setNumber(todoArray.length);
          });
    
          return () => {
            unsub();
          };
        };
    
        getTodo();
      }, []);

    const handleTextSubmit = async () => {
        if (text) {
            await updateDoc(doc(db, "todo", '' + dataMe.id), {
              todo: arrayUnion({
                text,
                done: false,
              }),
            });
        }
        setText('');
    }

    const toggleCheck = async (taskIndex) => {
      const updatedTodo = [...todo];
      updatedTodo[taskIndex].done = !updatedTodo[taskIndex].done;
      setTodo(updatedTodo);
  
      // Mettre à jour la base de données Firebase
      await updateDoc(doc(db, "todo", '' + dataMe.id), {
        todo: updatedTodo,
      });
    };
  
    const deleteTask = async (taskIndex) => {
      const updatedTodo = [...todo];
      updatedTodo.splice(taskIndex, 1);
      setTodo(updatedTodo);
  
      // Mettre à jour la base de données Firebase
      await updateDoc(doc(db, "todo", '' + dataMe.id), {
        todo: updatedTodo,
      });
    };

    const customComponentStyle = (isChecked) => {
      return ("backgroundColor: isChecked ? '#ff3967' : 'transparent'")
    };

    return (
      bigScreenStatus ? (
        <View style={styles.bigBulle}>
          <TouchableOpacity style={styles.backButton} onPress={() => setBigScreenStatus(false)}>
            <FontAwesome5 name="chevron-left" style={styles.backIcon} />
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
          <FlatList
            data={todo}
            renderItem={({ item, index }) => (
              <View style={styles.taskContainer}>
                <TouchableOpacity style={styles.customContainer} onPress={() => toggleCheck(index)}>
                  <FontAwesome5 name={item.done ? "minus" : "check"} style={styles.actionIcon} />
                </TouchableOpacity>
                <View style={styles.taskTextContainer}>
          <Text style={item.done ? styles.doneTask : styles.newTask}>{item.text}</Text>
        </View>
                <View style={styles.textContainer}>
                <TouchableOpacity onPress={() => deleteTask(index)} style={styles.deleteButton}>
          <FontAwesome5 name="times" style={styles.deleteIcon} />
        </TouchableOpacity>
        </View>
              </View>
            )}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={styles.flatListContainer}
          />
          <TextInput
            style={styles.inputField}
            placeholder="Add a task..."
            placeholderTextColor="white"
            onChangeText={(text) => setText(text)}
            value={text}
            onSubmitEditing={handleTextSubmit}
          />
          <TouchableOpacity
            style={styles.addButton}
            onPress={handleTextSubmit}
          >
              <FontAwesome5 name="plus" style={styles.addIcon} />
            <Text style={styles.addButtonLabel}>Adding</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity style={styles.bigBulle} onPress={() => setBigScreenStatus(true)}>
          <Text style={styles.numberText}>{number}</Text>
          <Text style={styles.todoText}>Task{number > 1 ? 's' : ''}</Text>
        </TouchableOpacity>
      )
    );
  };
  
  export default TodoComponent;
  
  const styles = StyleSheet.create({
    bigBulle: {
      flex: 1,
      backgroundColor: 'rgba(255, 57, 86, 0.7)',
      padding: 20,
    },
    backButton: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    backIcon: {
      fontSize: 18,
      color: 'white',
      marginRight: 2,
      marginBottom: '2%',
    },
    backButtonText: {
      fontSize: 18,
      fontWeight: 'bold',
      color: 'white',
      marginBottom: '2%',
    },
    numberText: {
      fontSize: 36,
      fontWeight: 'bold',
      color: 'white',
    },
    todoText: {
      fontSize: 18,
      color: 'white',
    },
    taskContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
    },
    doneTask: {
      fontSize: 16,
      color: '#777',
      textDecorationLine: 'line-through',
    },
    newTask: {
      fontSize: 16,
      color: 'white',
    },
    actionIcon: {
      fontSize: 20,
      color: 'white',
      marginLeft: '5%',
      marginTop: '5%',

    },
    flatListContainer: {
      paddingBottom: 20,
    },
    inputField: {
      height: 40,
      borderWidth: 1,
      borderColor: 'white',
      borderRadius: 10,
      paddingHorizontal: 10,
      marginTop: 10,
      marginBottom: 10,
      color: 'white',
    },
    addButton: {
      backgroundColor: 'white',
      borderRadius: 10,
      paddingVertical: 10,
      alignItems: 'center',
    },
    addButtonLabel: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#ff3967',
    },
    deleteButton: {
      backgroundColor: 'transparent',
    },
    
    deleteIcon: {
      fontSize: 20,
      color: 'white',
      marginLeft: '55%',
      marginTop: '5%',
      alignSelf: 'flex-start'
    },
    textContainer: {
      flex: 1,
      marginLeft: 10,
    },
    taskTextContainer: {
      flex: 1,
      marginLeft: 10,
      width: '95%',
    },    
  });