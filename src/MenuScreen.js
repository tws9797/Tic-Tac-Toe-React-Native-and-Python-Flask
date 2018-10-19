import React, { Component } from 'react';
import {
  Text,
  View,
  AppState,
  StyleSheet,
  Image,
  ToastAndroid,
  AsyncStorage
} from 'react-native';
import { Button } from 'react-native-elements'
import { Header } from './UI';
import { StopSound, PlaySoundRepeat } from 'react-native-play-sound';
import styles from './styles/tictactoe';
import io from 'socket.io-client';

//Connect to a socket
var socket = io.connect('http://10.0.2.2:5000/tictactoe', {
    transports: ['websocket'],
});

export default class MenuScreen extends Component {

  static navigationOptions = {
    header: null,
  };

  constructor(props){
    super(props);

    this.state = {
      appState: AppState.currentState,
      playSound: false,
    }

    //To disable the online button
    socket.on("connect_error", ()=>{
      this.setState({connect:false})
    })

    //To enable the online button
    socket.on("connect", ()=>{
      this.setState({connect:true})
    })

    this._onPress = this._onPress.bind(this);
    this._refresh = this._refresh.bind(this);
  }

  _refresh(){
    socket = io.connect('http://10.0.2.2:5000/tictactoe', {
        transports: ['websocket'],
    });
    this.setState({connect:false})
  }

  //Handle changes of app state to prevent the background music continue to play when close the app
  componentDidMount() {
    this._readSettings();
    AppState.addEventListener('change', this._handleAppStateChange);
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange);
  }

  //Stop sound when the app is in background
  _handleAppStateChange = (currentAppState) => {
    if(currentAppState == "background") {
      StopSound()
    }
  }

  //Read the previous state of the sound setting
  async _readSettings() {
    try {
      let playSound = await AsyncStorage.getItem('playSound')
      if(playSound == 'true') {
        this.setState({playSound: true})
        PlaySound('tictactoe')
      }
      else {
        this.setState({playSound: false})
        StopSound()
      }
    } catch (error) {
      console.log('## ERROR READING ITEMS ##: ', error);
    }
  }

  //Save the sound setting to the async storage
  async _saveSetting(key, value) {
    try {
      await AsyncStorage.setItem(key,value);
    } catch(error) {
      console.log('## ERROR SAVING ITEM ##', error);
    }
  }

  //If the server is online, navigate the screen to online screen
  //If the server is offline, show the server is offline
  _onPress(){
    if(this.state.connect){
      this.props.navigation.navigate('Online',{
        username: this.props.username,
        socket: socket,
        refresh: this._refresh
      })
    }
    else{
      ToastAndroid.show('The server is offline', ToastAndroid.LONG);
    }
  }

  render(){

    return(
      <View style={[styles.container, {justifyContent: 'center'}]}>
        <Image
          style={styles.image}
          source={require('./img/tictactoe.jpg')}
        />
        <Text style={styles.title}>Welcome, {this.props.username}</Text>
        <Button
          large
          leftIcon={{name: 'videogame-asset'}}
          title='SINGLE PLAYER'
          fontWeight='bold'
          backgroundColor='#FF3B2F'
          fontFamily= 'Segoe UI'
          fontSize={18}
          buttonStyle={styles.button}
          containerViewStyle={[styles.containerViewStyle, {marginTop: 30}]}
          onPress={() => this.props.navigation.navigate('Single')}
        />
        <Button
          large
          icon={{name: 'users',type:'feather'}}
          title='MULTIPLAYER'
          fontWeight='bold'
          backgroundColor='#FF3B2F'
          fontFamily= 'Segoe UI'
          fontSize={18}
          buttonStyle={styles.button}
          containerViewStyle={styles.containerViewStyle}
          onPress={() => this.props.navigation.navigate('Multi')}
        />
        <Button
          large
          icon={{name: 'globe', type: 'entypo'}}
          title='ONLINE'
          fontWeight='bold'
          backgroundColor='#FF3B2F'
          fontFamily='Segoe UI'
          fontSize={18}
          buttonStyle={styles.button}
          containerViewStyle={styles.containerViewStyle}
          onPress={this._onPress}
        />
        {
            this.state.playSound ?
            <Button
              large
              icon={{name: 'sound', type: 'entypo'}}
              title='Sound : On'
              fontWeight='bold'
              backgroundColor='#FF3B2F'
              fontFamily= 'Segoe UI'
              fontSize={18}
              buttonStyle={styles.button}
              containerViewStyle={styles.containerViewStyle}
              onPress={() => {
                StopSound()
                this.setState({playSound: false})
                this._saveSetting('playSound', false.toString())
              }}
            /> :
              <Button
                large
                icon={{name: 'sound-mute', type: 'entypo'}}
                title='Sound : Off'
                fontWeight='bold'
                backgroundColor='#FF3B2F'
                fontFamily= 'Segoe UI'
                fontSize={18}
                buttonStyle={styles.button}
                containerViewStyle={styles.containerViewStyle}
                onPress={() => {
                  PlaySoundRepeat('tictactoe')
                  this.setState({playSound: true})
                  this._saveSetting('playSound', true.toString())
                }}
              />
          }
        </View>
    )
  }
}

/*
 * Possible Improvements:
 * The sound cannot be play the second time the app is open.
 */
