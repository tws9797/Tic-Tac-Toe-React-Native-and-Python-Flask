import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image
} from 'react-native';

export default class Cross extends Component{
  render(){
    const { xTranslate, yTranslate } = this.props;
    return (
      //pointerEvents is to prevent the native event take the x and y position relative to the Circle image instead of the board
      <View
        pointerEvents="none"
        style={[styles.container,{
          transform: [
            {translateX: xTranslate ? xTranslate : 10},
            {translateY: yTranslate ? yTranslate : 10}
          ]
        }]} >
        <Image style={{width: 80, height: 80}}
          source = {require('../img/cross.jpg')} />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center'
  }
})
