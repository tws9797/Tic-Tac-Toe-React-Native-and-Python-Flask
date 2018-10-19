import React, { Component } from 'react'
import {
  TouchableWithoutFeedback,
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  ToastAndroid,
  Alert,
  ActivityIndicator
} from 'react-native';
import { Icon, Button } from 'react-native-elements';
import Dialog from "react-native-dialog";
import styles from './styles/tictactoe';

export default class OnlineScreen extends Component {

  static navigationOptions = ({navigation}) => {
    return{
      title: navigation.getParam('username')
    };
  };

  constructor(props) {
    super(props);
    this.state= {
      username: props.navigation.getParam('username'),
      socket: props.navigation.getParam('socket'),
      playerNum: 0,
      createCode: '',
      joinCode: '',
      gameCode: '',
      isLoading: false,
      dialogVisible: false
    }

    // When connected, emit a message to the server to inform that this client has connected to the server.
    this.state.socket.on('connect', () => {
        socket.emit('client_connected', {connected: true});
    });

    // Handle connection error
    this.state.socket.on('error', (error) => {
        ToastAndroid.show('Failed to connect to server', ToastAndroid.LONG);
        this.props.navigation.getParam('refresh')();
        this.props.navigation.goBack();
    })

    this._createRoom = this._createRoom.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleConfirm = this.handleConfirm.bind(this);
    this.showDialog = this.showDialog.bind(this);
  }

  componentDidMount(){

    //When receive game start respond, the game will stop the activity indicator
    //The application will navigate to OnlineBoard
    this.state.socket.on("game start", () => {
      this.setState({
        isLoading: false,
        dialogVisible: false,
      })
      this.props.navigation.navigate('OnlineBoard',{
        username: this.state.username,
        socket: this.state.socket,
        gameCode: this.state.gameCode,
        playerNum: this.state.playerNum
      })
    });

    //The no room respond will emit if the room user type in is not found
    this.state.socket.on("no room", (data)=>{
      ToastAndroid.show(data.status, ToastAndroid.LONG);
      this.setState({joinCode: ''});
      this.setState({gameCode: ''});
    })
  }

  //The player number will be set to 2 if the player press the join room button
  _joinRoom(){
    this.state.socket.emit("join", this.state.joinCode);
    this.setState({
      playerNum: 2,
      gameCode: this.state.joinCode
    });
  }

  //The player number will be set to 1 if the player press the create room button
  //The room code will be created randomly
  _createRoom(){
    let roomCode = (Math.floor(Math.random() * 10000) + 100000).toString().substring(2);
    // Works on both iOS and Android
    let username = this.state.username;

    Alert.alert(
       username + '\'s Room Number',
      'Your room number : ' + roomCode + '\n\n' + 'Please share to your friend to play together!',
      [
        {text: 'OK', onPress: () => console.log('OK Pressed')},
      ],
      { cancelable: false }
    )

    this.setState({
      isLoading: true,
      playerNum: 1,
      createCode: roomCode,
      gameCode: roomCode,
    })

    this.state.socket.emit("create room", roomCode);
  }

  showDialog(){
    this.setState({ dialogVisible: true });
  }

  handleCancel(){
    this.setState({ dialogVisible: false});
  };

  handleConfirm(){
    this._joinRoom();
    this.setState({ dialogVisible: false });
  };

  //Show loading icon when create room is pressed
  render() {
    return (
      <View style={{flex: 1}}>
        { this.state.isLoading ? (
          <View style={[styles.container, {justifyContent: 'center'}]}>
            <ActivityIndicator size="large" color="#FF3B2F" style={{paddingBottom: 20}}/>
            <Text style={{color: 'white'}}>Waiting for your friend to join</Text>
            <Text style={{color: 'white'}}>{this.state.createCode}</Text>
          </View>
        ) : (
          <View style={styles.container}>
          <Button
            large
            leftIcon={{name: 'videogame-asset'}}
            title='Create Room'
            fontWeight='bold'
            backgroundColor='#FF3B2F'
            fontFamily= 'Segoe UI'
            fontSize={18}
            buttonStyle={styles.button}
            containerViewStyle={{width: '80%', marginTop: 30}}
            onPress={this._createRoom}
          />
          <Button
            large
            icon={{name: 'users',type:'feather'}}
            title='Join Room'
            fontWeight='bold'
            backgroundColor='#FF3B2F'
            fontFamily= 'Segoe UI'
            fontSize={18}
            buttonStyle={styles.button}
            containerViewStyle={{width: '80%', marginTop: 20, marginBottom: 20}}
            onPress={this.showDialog}
          />
          <Dialog.Container visible={this.state.dialogVisible}>
            <Dialog.Title>Room Number</Dialog.Title>
            <Dialog.Description>
              Please enter the room number.
            </Dialog.Description>
            <Dialog.Input
                placeholder={'Room Number'}
                value={this.state.joinCode}
                onChangeText={(joinCode)=>{this.setState({joinCode})}}
                keyboardType="numeric">
              </Dialog.Input>
            <Dialog.Button label="Cancel" onPress={this.handleCancel} />
            <Dialog.Button label="Confirm" onPress={this.handleConfirm} />
          </Dialog.Container>
          </View>
      )
      }
      </View>
    )
  }
}

/*
 * Possible Improvements:
 * The dialog screen input will retained during next time input.
 */
