import React, { Component } from 'react'
import {
  TouchableWithoutFeedback,
  TouchableOpacity,
  View,
  Text,
  StyleSheet
} from 'react-native'
import {
  CENTER_POINTS,
  AREAS,
  CONDITIONS,
  GAME_RESULT_NO,
  GAME_RESULT_USER,
  GAME_RESULT_AI,
  GAME_RESULT_TIE
} from './constants/game'
import GameBoard from './GameBoard.js';
import styles from './styles/tictactoe';

export default class MultiPlayerScreen extends Component {

  static navigationOptions = ({navigation}) => {
    return{
      title: 'Two Players'
    };
  };


  constructor(props) {
    super(props);
    this.state= {
      firstPlayer: [],
      secondPlayer: [],
      firstPlayerScore: 0,
      secondPlayerScore: 0,
      result: GAME_RESULT_NO,
      playerTurn: 1,
      round: 0
    }
  }

  restart() {
    const { round } = this.state
    this.setState({
      firstPlayer: [],
      secondPlayer: [],
      result: GAME_RESULT_NO,
      round: round + 1,
      playerTurn: 1,
    })
    if(round % 2 === 1){
      this.setState({playerTurn: 2})
    }
  }

  //Action when clicked
  boardClickHandler(e: Object) {
    //Set the locationX and locationY the user clicked
    const { locationX, locationY } = e.nativeEvent
    const { firstPlayer, secondPlayer, result, playerTurn } = this.state
    //Ignore if the result is already set
    if (result !== -1) {
      return
    }

    const inputs = firstPlayer.concat(secondPlayer)

    const area = AREAS.find(d =>
      (locationX >= d.startX && locationX <= d.endX) &&
      (locationY >= d.startY && locationY <= d.endY))

    if (area && inputs.every(d => d !== area.id)) {
      if(playerTurn == 1){
        this.setState({
          firstPlayer: firstPlayer.concat(area.id),
          playerTurn: 2
         })
      }
      else if(playerTurn == 2){
        this.setState({
          secondPlayer: secondPlayer.concat(area.id),
          playerTurn: 1
         })
      }
      setTimeout(() => {
        this.judgeWinner()
      }, 5)
    }
  }

  generateResultText(result: number) {
    switch (result) {
      case GAME_RESULT_USER:
        return 'First Player ( O ) won the game!'
      case GAME_RESULT_AI:
        return 'Second Player ( X ) won the game!'
      case GAME_RESULT_TIE:
        return 'Tie!'
      default:
        return ''
    }
  }

  componentDidMount() {
    this.restart()
  }

  isWinner(inputs: number[]) {
    //If one of the conditions match the input, return true
    //If all item in the condition match the input, return true
    return CONDITIONS.some(d => d.every(item => inputs.indexOf(item) !== -1))
  }

  judgeWinner() {
    const { firstPlayer, secondPlayer, result, firstPlayerScore, secondPlayerScore} = this.state
    const inputs = firstPlayer.concat(secondPlayer)

    if (inputs.length >= 5 ) {
      let res = this.isWinner(firstPlayer)
      if (res && result !== GAME_RESULT_USER) {
        return this.setState({ result: GAME_RESULT_USER, firstPlayerScore: firstPlayerScore + 1 })
      }
      res = this.isWinner(secondPlayer)
      if (res && result !== GAME_RESULT_AI) {
        return this.setState({ result: GAME_RESULT_AI, secondPlayerScore: secondPlayerScore + 1 })
      }
    }

    if (inputs.length === 9 &&
        result === GAME_RESULT_NO && result !== GAME_RESULT_TIE) {
      this.setState({ result: GAME_RESULT_TIE })
    }
  }

  render() {
    const { firstPlayer, secondPlayer, result, playerTurn, firstPlayerScore, secondPlayerScore } = this.state
    return (
      <View style={styles.container}>
        <GameBoard
          onPress={e => this.boardClickHandler(e)}
          result={result}
          userInputs={firstPlayer}
          rivalInputs={secondPlayer}
        />
        <View style={styles.scoreBoard}>
          <View style={styles.score}>
            <Text style={styles.text}>{firstPlayerScore}</Text>
            <Text style={styles.text}>1st Player</Text>
          </View>
          <View style={styles.score}>
            <Text style={{fontSize: 50}}>-</Text>
          </View>
          <View style={styles.score}>
            <Text style={styles.text}>{secondPlayerScore}</Text>
            <Text style={styles.text}>2nd Player</Text>
          </View>
        </View>
        {
          result !== GAME_RESULT_NO ? (
            <View>
              <Text style={[styles.result, {fontSize: 25}]}>{ this.generateResultText(result) }</Text>
              <TouchableOpacity onPress={() => this.restart()}>
                <Text style={styles.instructions}>
                  Touch here to play again
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <Text style={[styles.instructions, {fontWeight: 'bold', fontSize: 19}]}>
              {
                playerTurn == 1 ? 'First Player Turn ( O )' : 'Second Player Turn ( X )'
              }
            </Text>
          )
        }
      </View>
    )
  }
}
