import React, { Component } from 'react'
import {
  TouchableWithoutFeedback,
  TouchableOpacity,
  StyleSheet,
  View,
  PanResponder,
  Text,
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

export default class SinglePlayerScreen extends Component {

  static navigationOptions = ({navigation}) => {
    return{
      title: 'Single Player'
    };
  };

  constructor(props) {
    super(props);
    this.state= {
      AIInputs: [],
      userInputs: [],
      AIScore: 0,
      userScore: 0,
      result: GAME_RESULT_NO,
      round: 0
    }
  }

  restart() {
    const { round } = this.state
    this.setState({
      userInputs: [],
      AIInputs: [],
      result: GAME_RESULT_NO,
      round: round + 1
    })
    setTimeout(() => {
      if (round % 2 === 0) {
        this.AIAction()
      }
    }, 5)
  }


  //Action when clicked
  boardClickHandler(e: Object) {
    console.log(e.nativeEvent);
    //Set the locationX and locationY the user clicked
    const { locationX, locationY } = e.nativeEvent
    const { userInputs, AIInputs, result } = this.state
    //Ignore if the result is already set
    if (result !== -1) {
      return
    }

    //Save all the inputs
    const inputs = userInputs.concat(AIInputs)

    //Get the area id that within the area range clicked
    const area = AREAS.find(d =>
      (locationX >= d.startX && locationX <= d.endX) &&
      (locationY >= d.startY && locationY <= d.endY))

    //If area exist and the area id does not exist in the inputs
    if (area && inputs.every(d => d !== area.id)) {

      //Set the user input equal to the area id clicked
      this.setState({ userInputs: userInputs.concat(area.id) })

      //Judge who is the winner
      //If there is no result, let the AI make the move
      setTimeout(() => {
        this.judgeWinner()
        this.AIAction()
      }, 5)
    }
  }

  AIAction() {
    const { userInputs, AIInputs, result } = this.state
    if (result !== -1) {
      return
    }
    while(true) {
      const inputs = userInputs.concat(AIInputs)

      const randomNumber = Math.round(Math.random() * 8.3)
      if (inputs.every(d => d !== randomNumber)) {
        this.setState({ AIInputs: AIInputs.concat(randomNumber) })
        this.judgeWinner()
        break
      }
    }
  }

  generateResultText(result: number) {
    switch (result) {
      case GAME_RESULT_USER:
        return 'You won the game!'
      case GAME_RESULT_AI:
        return 'AI won the game!'
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
    const { userInputs, AIInputs, result, AIScore, userScore } = this.state
    const inputs = userInputs.concat(AIInputs)

    if (inputs.length >= 5 ) {
      let res = this.isWinner(userInputs)
      if (res && result !== GAME_RESULT_USER) {
        return this.setState({ result: GAME_RESULT_USER, userScore: userScore + 1 })
      }
      res = this.isWinner(AIInputs)
      if (res && result !== GAME_RESULT_AI) {
        return this.setState({ result: GAME_RESULT_AI, AIScore: AIScore + 1 })
      }
    }

    if (inputs.length === 9 &&
        result === GAME_RESULT_NO && result !== GAME_RESULT_TIE) {
      this.setState({ result: GAME_RESULT_TIE })
    }
  }

  render() {
    const { userInputs, AIInputs, result, userScore, AIScore } = this.state
    return (
    <View style={styles.container}>
      <GameBoard
        onPress={e => this.boardClickHandler(e)}
        result={result}
        onRestart={() => this.restart()}
        userInputs={userInputs}
        rivalInputs={AIInputs}
      />
    <View style={styles.scoreBoard}>
      <View style={styles.score}>
        <Text style={styles.text}>{userScore}</Text>
        <Text style={styles.text}>You</Text>
      </View>
      <View style={styles.score}>
        <Text style={{fontSize: 50, fontWeight: 'bold'}}>-</Text>
      </View>
      <View style={styles.score}>
        <Text style={styles.text}>{AIScore}</Text>
        <Text style={styles.text}>AI</Text>
      </View>
    </View>
    {
      result !== GAME_RESULT_NO && (
        <View>
          <Text style={styles.result}>{ this.generateResultText(result) }</Text>
          <TouchableOpacity onPress={() => this.restart()}>
            <Text style={styles.instructions}>
              Touch here to play again
            </Text>
          </TouchableOpacity>
        </View>
      )
    }
    </View>
    )
  }
}
