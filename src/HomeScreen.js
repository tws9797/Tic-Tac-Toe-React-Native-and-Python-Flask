import React, { Component } from 'react';
import {
  AsyncStorage,
  View,
} from 'react-native';
import MenuScreen from './MenuScreen';
import SignupScreen from './SignupScreen';

export default class HomeScreen extends Component {

  //Hide the navigation header
  static navigationOptions = {
    header: null
  }

  constructor(props){
    super(props)

    this.state = {
      username: '',
      container: '',
    }
  }

  componentDidMount(){
    //Read username everytime the app launched
    this._readSettings();
  }

  //Save username in async storage
  async _saveSetting(key, value) {
    try {
      await AsyncStorage.setItem(key,value);
    } catch(error) {
      console.log('## ERROR SAVING NAME ##', error);
    }
  }

  //Read username from async storage
  async _readSettings(){
    try {
      let username = await AsyncStorage.getItem('username');
      if (username !== null) {
        this.setState({username: username});
      }
    } catch (error) {
      console.log('## ERROR READING NAME ##: ', error);
    }
  }

  render(){

    let isUsernameExist = this.state.username !== '' ? true : false;
    const { container } = this.state;

    return(
      <View style={{flex: 1}}>
        {
          isUsernameExist ?
          (
              //If the username has been entered before, show menu screen
              <MenuScreen navigation={this.props.navigation} username={this.state.username} />
          ) : (
              //If the user launch the app for the first time, the user must sign up a username
              //Use a container to store temporary username
              //Prevent the page isUsernameExist state changed as soon as the user type character
              //Set the username only when button is pressed to reload the screen
              <SignupScreen
                value={this.state.container}
                onChangeText={(container)=>{
                  this.setState({container});
                  this._saveSetting('username', container);
                }}
                onPress={()=>{
                  this.setState({username: container})
                }}
              />
          )
        }
      </View>
    )
  }
}

/*
 * Possible Improvements:
 * After sign up, the sign up screen still will pop out for a short instance
 * before the menu screen appear everytime the app is open or reload.
 */
