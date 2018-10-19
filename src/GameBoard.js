import React, { Component } from 'react'
import {
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import Circle from './components/Circle';
import Cross from './components/Cross';
import {
  CENTER_POINTS,
} from './constants/game';
import styles from './styles/tictactoe';

export default class GameBoard extends Component {

  render() {
    return (
      <View style={styles.boardContainer}>
        <TouchableWithoutFeedback onPress={this.props.onPress}>
          <View style={styles.board}>
            <View
              style={styles.line}
            />
            <View
              style={[styles.line, {
                width: 3,
                height: 306,
                transform: [
                  {translateX: 200}
                ]
              }]}
            />
            <View
              style={[styles.line, {
                width: 306,
                height: 3,
                transform: [
                  {translateY: 100}
                ]
              }]}
            />
            <View
              style={[styles.line, {
                width: 306,
                height: 3,
                transform: [
                  {translateY: 200}
                ]
              }]}
            />
            {
              this.props.userInputs.map((d, i) => (
                <Circle
                  key={i}
                  xTranslate={CENTER_POINTS[d].x}
                  yTranslate={CENTER_POINTS[d].y}
                />
              ))
            }
            {
              this.props.rivalInputs.map((d, i) => (
                <Cross
                  key={i}
                  xTranslate={CENTER_POINTS[d].x}
                  yTranslate={CENTER_POINTS[d].y}
                />
              ))
            }
          </View>
        </TouchableWithoutFeedback>
      </View>
    )
  }
}
