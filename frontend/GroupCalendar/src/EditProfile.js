'user strict';

import React, {Component} from 'react';
import {View, StyleSheet, Alert, Button, ScrollView, DatePickerIOS,
	FlatList, ActivityIndicator, Picker} from 'react-native';
import Network from './common/GCNetwork';
import cs from './common/CommonStyles';
import {TextField} from 'react-native-material-textfield';


const configMap = {
		userLastname : {
			label: 'Last Name',
			autoCapitalize: 'words',
			secureTextEntry: false,
		},
		userFirstname : {
			label: 'First Name', 
			autoCapitalize: 'words',
			secureTextEntry: false,
		},
		userDescription: {
			label: 'What\'s Up',
			autoCapitalize: 'sentences',
			secureTextEntry: false,
		},
		userRegion: {
			label: 'Region',
			autoCapitalize: 'words',
			secureTextEntry: false,
		},
};

export default class EditProfile extends Component {
	static navigationOptions = {
		title: 'Edit Profile',
	}

	constructor(props) {
		super(props);

		this.state = {
			isLoading : true,
			pickerFlag : false,
		};
		this._onChangeDate = this._onChangeDate.bind(this);
		this._onChangeText = this._onChangeText.bind(this);
		this._onPickGender = this._onPickGender.bind(this);
		this._onSubmit = this._onSubmit.bind(this);
		this._renderItem = this._renderItem.bind(this);
	}

	componentDidMount() {
		let {navigation} = this.props;
		const editInfo = navigation.getParam('editInfo', null);
		const userId = navigation.getParam('userId', null);
		const refresh = navigation.getParam('refresh', null);
		var items = [];
		if (editInfo && userId && refresh) {
			//get all keys
			var i = 0;
			for (key in editInfo) {
				if (!editInfo.hasOwnProperty(key)) {
					continue;
				}
				var info = editInfo[key];
				items.push({key: i.toString(), [key]: info});
				i = i + 1;
			}

			this.setState({
				isLoading : false,
				isUpdating: false,
				data: items,
				userId,
				refresh,
			});
		} else {
			Alert.alert('Something went wrong');
			navigation.goBack();
		}
	}
	_renderItem({item}){
		var name;
		//last one is what we want
		for (object in item) {
			name = object;
		}
		switch (name) {
			case 'userBirth' : {
				let date = new Date(item[name]);
				let curr = new Date();
				let mini = new Date();
				mini.setFullYear(1900);
				return (
					<View style = {s.contentContainer}>
					<DatePickerIOS
						testID = 'datePicker'
						date = {date}
						onDateChange = {this._onChangeDate}
						mode = 'date'
						maximumDate = {curr}
						minimumDate = {mini}
					/>
					</View>
				);
			}
			case 'userGender' : {
				let gender = item[name];
				if (gender == '') {
					gender = 'Male';
				}
				return (
					<View style = {s.contentContainer}>
					<Picker 
						testID = 'genderPicker'
						selectedValue = {gender}
						onValueChange = {this._onPickGender}
					>
					<Picker.Item label = 'Male' value = 'Male'/>
					<Picker.Item label = 'Female' value = 'Female'/>
					<Picker.Item label = 'Secret' value = 'Secret'/>
					</Picker>
					</View>
				)
			}
			default: {
				let config = configMap[name];
				return (
					<View style = {[s.contentContainer]}>
					<TextField
						testID = {config.label}
						label = {config.label}
						value = {item[name] ? item[name] : ''}
						onChangeText = {(text) => 
							this._onChangeText(item.key, name, text)}
						autoCorrect = {false}
						autoCapitalize = {config.autoCapitalize}
						secureTextEntry = {config.secureTextEntry}
						labelHeight = {28}
					/>
					</View>
				);
			}
		}
	}

	_onPickGender(value){
		let{data, pickerFlag} = this.state;
		data[0].userGender = value;
		this.setState({
			data,
			pickerFlag: !pickerFlag
		});
	} 

	_onChangeDate(date){
		let {data} = this.state;
		data[0].userBirth = date.toJSON().substr(0, 10);
		this.setState({data});
	}

	_onChangeText(_key, _name, _text){
		let {data} = this.state;
		data[_key][_name] = _text;
		this.setState({data});
	}

	async _onSubmit(){
		let {data, userId} = this.state;
		let update = {};

		for (object in data) {
			let key = parseInt(object);
			for (name in data[key]) {
				if (name !== 'key') {
					update[name] = data[key][name];
				}
			}
		}
		this.setState({isUpdating: true});
		try {
			let status = await Network.updateProfile(update, userId);
			switch(status) {
				case 200: {
					this.state.refresh(false);
					this.props.navigation.goBack();
				}
				break;
				case 400: 
				case 404: {
					Alert.alert('Invalid User Info');
				}
				break;
				default: Alert.alert('HTTP ERROR');
			}
		} catch (error) {
			Alert.alert(JSON.stringify(error));
		}
		this.setState({isUpdating: false});
	}

	render() {
		let {isLoading, isUpdating} = this.state;
		if(isLoading) {
			return (
				<View style = {cs.container}>
					<ActivityIndicator size = 'large'/>
				</View>
			);
		}
		let {data} = this.state;
		return (
			<ScrollView
				style = {[s.scrollContainer]}
				keyboardShouldPersistTaps = 'never'
			>
				<FlatList 
					data = {data}
					renderItem = {this._renderItem}
					extraData = {this.state.pickerFlag}
				/>
				<Button
					disabled = {isUpdating}
					onPress = {this._onSubmit}
					title = {isUpdating ? 'Submitting...' : 'Submit'}
				/>
			</ScrollView>
		)
	}
}

const s = StyleSheet.create({
	contentContainer: {
		marginLeft: '10%',
		width: '80%',
		flex: 1,
	},
	scrollContainer:{
		backgroundColor: '#ffffff',
		width: '100%',
		height: '100%',
	}
});