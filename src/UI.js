import React, { Component } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
} from 'react-native';

/*
 * InputWithLabel
 */

class InputWithLabel extends Component {
   constructor(props) {
       super(props);

       this.orientation = this.props.orientation ? (this.props.orientation == 'horizontal' ? 'row' : 'column') : 'column';
   }

   render() {
       return (
           <View style={[inputStyles.container, {flexDirection: this.orientation}]}>
             <TextInput style={[inputStyles.input, this.props.style]}
                 value={this.props.value}
                 onChangeText={this.props.onChangeText}
                 keyboardType={this.props.keyboardType ? this.props.keyboardType : 'default'}
                 secureTextEntry={this.props.secureTextEntry ? this.props.secureTextEntry : false}
                 selectTextOnFocus={this.props.selectTextOnFocus ? this.props.selectTextOnFocus : false}
                 editable={this.props.editable !== null ? this.props.editable : true}
                 underlineColorAndroid={'rgba(0,0,0,0)'}
                 textAlign={'center'}
             />
           </View>
       )
   }
}

const inputStyles = StyleSheet.create({
   container: {
     borderColor: '#BF1E2D',
     borderWidth: 2,
     borderRadius: 10,
     width: 300,
   },
   label: {
     fontWeight: 'bold',
     marginLeft: 3,
     textAlignVertical: 'center',
   },
   input: {
     color: '#FFF',
     fontSize: 18,
   },
});

/*
 * Header
 */
class Header extends Component {

   render(){
     return (
       <View style={styles.container}>
         <Text style={styles.title}>
           {this.props.title}
         </Text>
       </View>
     )
   }
 }

 const styles = StyleSheet.create({
   container: {
     backgroundColor: '#FF3B2F',
     flexDirection: 'row',
     justifyContent: 'center',
     alignItems: 'center',
     height: 60
   },
   title: {
     color: '#fff',
     fontWeight: 'bold',
     flex: 1,
     fontSize: 24,
     textAlign: 'center',
     margin: 10,
   }
 })

/*
 * Export modules
 */
module.exports = {
  InputWithLabel: InputWithLabel,
  Header: Header
}
