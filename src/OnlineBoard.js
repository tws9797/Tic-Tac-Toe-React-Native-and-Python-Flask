import React, { Component } from 'react'
import {
  TouchableWithoutFeedback,
  TouchableOpacity,
  View,
  Text,
  Alert,
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
} from './constants/game';
import GameBoard from './GameBoard.js';
import { Header } from './UI';
import { Button } from 'react-native-elements';
import styles from './styles/tictactoe';

export default class OnlineBoard extends Component {

  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state= {
      inputs: [],
      firstPlayer: [],
      secondPlayer: [],
      result: GAME_RESULT_NO,
      round: 0,
      playerTurn: 1,
      userScore: 0,
      rivalScore: 0,
      username: props.navigation.getParam('username'),
      rivalname: '',
      playerNum: props.navigation.getParam('playerNum'),
      socket: props.navigation.getParam('socket'),
      gameCode: props.navigation.getParam('gameCode')
    }

    this.leaveRoom = this.leaveRoom.bind(this);

  }

  componentWillMount(){

    const { firstPlayer, secondPlayer, username, rivalname, socket, playerNum, gameCode, round } = this.state

    socket.emit("get name", username, gameCode);

    socket.on("send name", (data) => {
      let result = JSON.parse(data)
      this.setState({
        rivalname: result.rivalname
      })
    });

    socket.on("playerOne",(data) => {
      let result = JSON.parse(data)
      this.setState({
        secondPlayer: secondPlayer.concat(result.areaId),
        playerTurn: result.playerTurn
      })
      setTimeout(() => {
        this.judgeWinner()
        this.updateScore()
      }, 5)
    });

    socket.on("playerTwo",(data) => {
      let result = JSON.parse(data)
      this.setState({
        firstPlayer: firstPlayer.concat(result.areaId),
        playerTurn: result.playerTurn
      })
      setTimeout(() => {
        this.judgeWinner()
        this.updateScore()
      }, 5)
    });

    socket.on('leave room',()=>{
      this.props.navigation.goBack();
    });

    socket.on('accept restart',()=>{
      Alert.alert('Restart request',  rivalname + ' has offered a rematch.', [
        {
          text: 'No',
          onPress: () => {},
        },
        {
          text: 'OK',
          onPress: () => {
            socket.emit("restart", gameCode);
          },
        },
      ], { cancelable: false });
    });

    socket.on('restart update',()=>{
      this.setState({
        firstPlayer: [],
        secondPlayer: [],
        result: GAME_RESULT_NO,
        round: round + 1,
        playerTurn: 1,
      })
    });

  }

  leaveRoom(){

    const { socket, gameCode } = this.state;

    Alert.alert('Confirm Exit', 'Leave Room `'+ gameCode +'`?', [
      {
        text: 'No',
        onPress: () => {},
      },
      {
        text: 'Yes',
        onPress: () => {
          socket.emit("leave", gameCode);
        },
      },
    ], { cancelable: false });
  }

  restart() {

    const { socket, gameCode } = this.state;

    socket.emit("request restart", gameCode)
    
  }


  //Action when clicked
  boardClickHandler(e: Object) {
    //Set the locationX and locationY the user clicked
    const { locationX, locationY } = e.nativeEvent
    const { firstPlayer, secondPlayer, result, socket, playerNum, gameCode, playerTurn } = this.state
    //Ignore if the result is already set
    if (result !== -1) {
      return
    }

    const inputs = firstPlayer.concat(secondPlayer)

    const area = AREAS.find(d =>
      (locationX >= d.startX && locationX <= d.endX) &&
      (locationY >= d.startY && locationY <= d.endY))

      if (area && inputs.every(d => d !== area.id)) {
        if(playerNum == 1 && playerTurn ==1){
           socket.emit("click", playerNum, area.id, gameCode)
        }
        else if(playerNum == 2 && playerTurn ==2){
           socket.emit("click", playerNum, area.id, gameCode)
        }
      }

    }


  isWinner(inputs: number[]) {
    //If one of the conditions match the input, return true
    //If all item in the condition match the input, return true
    return CONDITIONS.some(d => d.every(item => inputs.indexOf(item) !== -1))
  }

  updateScore(){
    const { result, playerNum, userScore, rivalScore } = this.state
      if(playerNum == 1 && result == GAME_RESULT_USER){
        return this.setState({userScore: userScore + 1})
      }
      if(playerNum == 1 && result == GAME_RESULT_AI){
        return this.setState({rivalScore: rivalScore + 1})
      }
      if(playerNum == 2 && result == GAME_RESULT_USER){
        return this.setState({rivalScore: rivalScore + 1})
      }
      if(playerNum == 2 && result == GAME_RESULT_AI){
        return this.setState({userScore: userScore + 1})
      }
  }

  judgeWinner() {
    const { firstPlayer, secondPlayer, result, playerNum } = this.state
    const inputs = firstPlayer.concat(secondPlayer)

    if (inputs.length >= 5 ) {
      let res = this.isWinner(firstPlayer)
      if (res && result !== GAME_RESULT_USER) {
        return this.setState({ result: GAME_RESULT_USER})
      }
      res = this.isWinner(secondPlayer)
      if (res && result !== GAME_RESULT_AI) {
        return this.setState({ result: GAME_RESULT_AI})
      }
    }

    if (inputs.length === 9 &&
        result === GAME_RESULT_NO && result !== GAME_RESULT_TIE) {
      this.setState({ result: GAME_RESULT_TIE })
    }

  }

  render() {
    return (
      <View style={styles.container}>
        <Header title={'Room ' + this.state.gameCode}/>
        <GameBoard
          onPress={e => this.boardClickHandler(e)}
          result={this.state.result}
          userInputs={this.state.firstPlayer}
          rivalInputs={this.state.secondPlayer}
        />
      <View style={styles.scoreBoard}>
        <View style={styles.score}>
          <Text style={styles.text}>{this.state.userScore}</Text>
          <Text style={styles.text}>{this.state.username}</Text>
        </View>
        <View style={styles.score}>
          <Text style={{fontSize: 50, fontWeight: 'bold'}}>-</Text>
        </View>
        <View style={styles.score}>
          <Text style={styles.text}>{this.state.rivalScore}</Text>
          <Text style={styles.text}>{this.state.rivalname}</Text>
        </View>
      </View>
      {
        this.state.result !== GAME_RESULT_NO ? (
          <TouchableOpacity onPress={() => this.restart()}>
            <Text style={styles.instructions}>
              Touch here to play again
            </Text>
          </TouchableOpacity>
        ) : (
          <Text style={[styles.instructions, {fontWeight: 'bold', fontSize: 19}]}>
            {
              this.state.playerTurn == this.state.playerNum ? 'Your Turn' : '' + this.state.rivalname + ' Turn'
            }
          </Text>
        )
      }
      <Button
        large
        icon={{name: 'users',type:'feather'}}
        title='Leave Room'
        fontWeight='bold'
        backgroundColor='#FF3B2F'
        fontFamily= 'Segoe UI'
        fontSize={18}
        buttonStyle={styles.button}
        containerViewStyle={{width: '80%', marginTop: 20, marginBottom: 20}}
        onPress={this.leaveRoom}
      />
    </View>
    )
  }
}

/*
 * Possible Improvements:
 * The dialog screen created when pressing create room will still retained if the user didn't close it in online screen.
 */
