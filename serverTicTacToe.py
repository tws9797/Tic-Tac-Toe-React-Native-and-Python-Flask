from flask import Flask, request
from flask_socketio import SocketIO, emit, join_room, close_room
import json

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app)
ROOMS = []
users = []
playerOne = ''
playerTwo = ''

@socketio.on('connect', namespace='/tictactoe')
def handle_connect_tictactoe():
    print('Connected to /tictactoe')

@socketio.on('client_connected', namespace='/tictactoe')
def handle_client_connected_tictactoe(json):
    print('Connection Status: {}'.format(json['connected']))

@socketio.on('create room', namespace='/tictactoe')
def handle_create_room(roomKey):
    if(roomKey != None and roomKey != ''):
        room = roomKey
        ROOMS.append(room)
        join_room(roomKey)

@socketio.on('join', namespace='/tictactoe')
def on_join(room):
    if room in ROOMS:
        if request.sid != playerOne:
            join_room(room)
            emit('game start', room=room)
            print('The game in ' + room + 'start')
    else:
        emit('no room', {'status' : "The room " + str(room) + " is not found."}, namespace='/tictactoe')

@socketio.on('leave', namespace='/tictactoe')
def on_leave(gameCode):
    room = gameCode
    if room in ROOMS:
        emit('leave room', room=room)
        print('The game end')
        close_room(room)

@socketio.on('click', namespace='/tictactoe')
def on_click(player, areaId, gameCode):
    room = gameCode
    if room in ROOMS:
        join_room(room)
        if player == 1:
            emit('playerTwo', json.dumps({'areaId': areaId, 'playerTurn' : 2}), room=room)
        elif player == 2:
            emit('playerOne', json.dumps({'areaId': areaId, 'playerTurn' : 1}), room=room)


@socketio.on('board changed',namespace='/tictactoe')
def on_change(result, gameCode):
    room = gameCode
    if room in ROOMS:
        join_room(room)
        emit('update result', json.dumps({'result': result}), room=room)

@socketio.on('get name',namespace='/tictactoe')
def on_gamestart(username, gameCode):
    room = gameCode
    if room in ROOMS:
        join_room(room)
        emit('send name',json.dumps({'rivalname': username}), room=room, include_self=False)

@socketio.on('request restart',namespace='/tictactoe')
def on_request_restart(gameCode):
    room = gameCode
    if room in ROOMS:
        join_room(room)
        emit('accept restart', room=room, include_self=False)

@socketio.on('restart', namespace='/tictactoe')
def on_restart(gameCode):
    room = gameCode
    if room in ROOMS:
        join_room(room)
        emit('restart update', room=room)

if __name__ == '__main__':
    socketio.run(app)
