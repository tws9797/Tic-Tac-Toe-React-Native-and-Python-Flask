import { StyleSheet } from 'react-native'

export default StyleSheet.create({

  boardContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    opacity: 0.8,
    marginTop: 20
  },
  board: {
    width: 312,
    height: 312,
    borderWidth: 3,
    borderColor: '#000'
  },
  line: {
    position: 'absolute',
    width: 3,
    height: 306,
    backgroundColor: '#FF3B2F',
    transform: [
      {translateX: 100}
    ]
  },
  container: {
    flex: 1,
    backgroundColor: '#1C1D1F',
    alignItems: 'center',
    flexDirection: 'column',
  },
  button: {
    borderColor: "#BF1E2D",
    borderWidth: 3,
    borderRadius: 50
  },
  title: {
    fontSize: 28,
    color: '#BF1E2D',
    fontWeight: 'bold'
  },
  image: {
    width: 100,
    height: 100,
    margin: 20
  },
  text: {
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  instructions: {
    marginTop: 15,
    color: '#FF3B2F',
    marginBottom: 5,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
  },
  scoreBoard: {
    marginTop: 20,
    height: 100,
    width: '80%',
    backgroundColor: '#FFF',
    borderColor: '#FF3B2F',
    borderWidth: 5,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    flexDirection: 'row',
  },
  result:{
    marginTop: 15,
    color: '#FFF',
    textAlign: 'center',
    fontSize: 28,
    fontWeight: 'bold',
  },
  menuLabel:{
    margin: 10,
    fontSize: 20,
    color: '#FFF',
    fontWeight: 'bold',
    fontFamily: 'Segoe UI'
  },
  containerViewStyle:{
    width: '80%',
    marginBottom: 20
  },
  score:{
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  }
})
