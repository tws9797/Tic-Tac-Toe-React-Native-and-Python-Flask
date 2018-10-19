import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
} from 'react-native';
import { InputWithLabel } from './UI';
import { Button } from 'react-native-elements';
import styles from './styles/tictactoe';

export default class SignupScreen extends Component {

  render(){
    return(
        <View style={[styles.container,{paddingTop: 50}]}>
          <Image
            style={{width: 200, height: 200, margin: 50}}
            source={require('./img/tictactoe.jpg')}
          />
        <Text style={styles.menuLabel}>
          ENTER YOUR USERNAME
          </Text>
          <InputWithLabel
            value={this.props.value}
            onChangeText={this.props.onChangeText}
            orientation={'vertical'}
          />
          <Button
            large
            leftIcon={{name: 'videogame-asset'}}
            title='CONFIRM'
            fontWeight='bold'
            backgroundColor='#FF3B2F'
            fontFamily= 'Segoe UI'
            fontSize={18}
            buttonStyle={styles.button}
            containerViewStyle={[styles.containerViewStyle,{marginTop: 30}]}
            onPress={this.props.onPress}
          />
        </View>
    )
  }
}

/*
 * Possible Improvements:
 * The screen should be push up when the keyboard is shown as
 * the keyboard has blocked most of the screen.
 */
