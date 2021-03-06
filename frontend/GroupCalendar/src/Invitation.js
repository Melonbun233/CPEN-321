'use strict';
/**
 * This page constructs the invitation view
 */

import React, {Component} from 'react';
import {AlertIOS, StyleSheet, Text, View, Button, Alert,TouchableOpacity,
	RefreshControl, ActivityIndicator, FlatList, ScrollView, TouchableWithoutFeedback} 
	from 'react-native';
import cs from './common/CommonStyles';
import Network from './common/GCNetwork';
import Storage from './common/Storage';
import SwipeOut from 'react-native-swipeout';
import SvgUri from 'react-native-svg-uri';

export default class Invitation extends Component {
	constructor(props) {
		super(props);
	
		this.state = {
			//refresh user's project list
			isRefreshing: false,
			//loading user's project list when first enter
			isLoading: true,
			extraData: false,
		};
	}

	//fetch user's invitation
	async componentDidMount() {
		var allInvitations;
		try{
			let profile = await Storage.getProfile();
			if (!profile) {
				Alert.alert('Something went wrong');
				this.props.onSessionOut();
			}
			let status = await Network.fetchAllInvitations(profile.userId);
			switch (status) {
				case 200:
				break;
				case 0: {
					Alert.alert('Not all invitations fetched');
				}
				break;
				case 401: {
					this.props.onSessionOut();
				}
				break;
				default: {
					this.props.onSessionOut();
				}
			}
			allInvitations = await Storage.getAllInvitations();
			
			this.setState({
				profile,
				allInvitations,
				isLoading: false,
			})
		} catch (error) {
			Alert.alert(JSON.stringify(error));
		}
	}

	async _onRefresh(animating) {
		let {profile} = this.state;
		var allInvitations;
		if (animating) {
			this.setState({isRefreshing: true});
		}
		try {
			let status = await Network.fetchAllInvitations(profile.userId);
			switch (status) {
				case 200:
				break;
				case 0: {
					Alert.alert('Not all invitations fetched');
				}
				break;
				default: Alert.alert('Internet Error ' + status.toString());
			}
			allInvitations = await Storage.getAllInvitations();
			this.setState({allInvitations});
		} catch (error) {
			Alert.alert(error.toString());
		}
		if (animating) {
			this.setState({isRefreshing: false});
		}
	}

	async _onRejectInvitation(projectId) {
		let {profile, allInvitations, extraData} = this.state;
		try {
			//for user experence set state here
			for (let key in allInvitations) {
				let value = allInvitations[key];
				if (value.projectId == projectId) {
					allInvitations.splice(key, 1);
				}
				this.setState({allInvitations, extraData: !extraData});
				break;
			}

			let status = await Network.rejectInvitation(projectId, profile.userId);
			if (status != 200) {
				Alert.alert('Internet Error ' + status.toString());
			}
			await this._onRefresh(false);
		} catch (error) {
			Alert.alert(error.toString());
		}
	}

	async _onAccetpInvitation(projectId) {
		let {profile, allInvitations, extraData} = this.state;
		try {
			//for user experience set state here
			for (let key in allInvitations) {
				let value = allInvitations[key];
				if (value.projectId == projectId) {
					allInvitations.splice(key, 1);
					this.setState({allInvitations, extraData: !extraData});
					break;
				}
			}

			let status = await Network.acceptInvitation(projectId, profile.userId);
			if (status != 200) {
				Alert.alert('Internet Error ' + status.toString());
			}
			await this._onRefresh(false);
		} catch (error) {
			Alert.alert(error.toString());
		}
	}

	_onPressProject(project) {
		let {profile} = this.state;
		let {projectId} = project;
		this.props.navigation.push('ProjectDetail', {
			projectId, profile, type: 'view',
			refreshAll: this._onRefresh.bind(this)});
	}

	async _onSearchUser(email) {
		try {
			let response = await Network.searchUserByEmail(email);
			switch (response.status) {
				case 200: {
					let userId = response.userId;
					this.props.navigation.push('ProfileDetail', {userId});
				}
				break;
				default: {
					Alert.alert('Cannot find the user');
				}
			}
		} catch (error) {
			Alert.alert(error.toString());
		}
	}

	_renderItem({item}) {
		let button = [{
			backgroundColor: 'red',
			underlayColor: 'red',
            color: 'white',
            text: 'DELETE',
            onPress: () => {
				this._onRejectInvitation(item.projectId);
			}
		}];
		return (
			
			<SwipeOut
                right = {button}
                autoClose = {true}
            >
			<TouchableWithoutFeedback
				testID = {item.projectName}
				onPress = {() => this._onPressProject(item)}
			>
			<View style = {s.contentContainer}>
				<View style = {s.project}>
				<Text style = {[cs.smallText, {padding: 5}]}>testInvitation from project</Text>
				<Text style = {[cs.normalText, {padding: 5}]}>{item.projectName}</Text>
				</View>
				<View style = {s.button}>
					<Button
						testID = 'acceptButton'
						title = 'Accept'
						onPress = {() => {
							this._onAccetpInvitation(item.projectId);
						}}
					/>
				</View>
			</View>
			</TouchableWithoutFeedback>
			</SwipeOut>
			
		);
	}

	render() {
		let {isLoading, isRefreshing} = this.state;
		if (isLoading) {
			return (
				<View style = {cs.container}>
					<ActivityIndicator size = 'large' animating = {false}/>
				</View>
			);
		}
		let {allInvitations, extraData} = this.state;
		let emptyMsg = (
			<View style = {[cs.container, {paddingTop: '20%', paddingBottom: '30%'}]}>
				<Text style = {cs.h5}>You don't have any invitation</Text>
			</View>
		);

		return (
			<ScrollView 
				style = {s.scrollContainer}
				keyboardShouldPersistTaps = 'never'	
				refreshControl = {
				<RefreshControl
					refreshing = {isRefreshing}
					onRefresh = {() => this._onRefresh(true)}
				/>
				}
			>
			<View style = {s.search}>
					<TouchableOpacity 
						style = {[s.button]}
						testID = 'searchUserButton'
						onPress = {() => {
								AlertIOS.prompt(
									'Enter user\'s email',
									'Enter user\'s email to search',
									[
										{
											text: 'Cancel',
										},
										{
											text: 'OK',
											onPress: (email) => {
												this._onSearchUser(email);
											}
										}
									],
									'plain-text',
									'',
									'email-address',
							);}}
					>
					<SvgUri width = {24} height = {24} 
						source = {require('../img/search.svg')}/>
					</TouchableOpacity>
			</View>
			<FlatList
					data = {allInvitations}
					renderItem = {this._renderItem.bind(this)}
					keyExtractor = {(item) => item.projectId.toString()}
					extraData = {extraData}
				/>
				{!allInvitations || allInvitations.length == 0 ? emptyMsg : null}
				<View style = {cs.empty}></View>
			</ScrollView>
		);
	}
}
const s = StyleSheet.create({
	scrollContainer: {
		backgroundColor: '#ffffff',
		width: '100%',
		height: '100%',
	},
	button: {
		padding: 10,
		alignItems: 'center',
	},
	project: {
		padding:10,
		alignItems: 'flex-start',
	},
	contentContainer: {
		paddingLeft: 5,
		paddingRight: 5,
		alignItems: 'center',
		justifyContent: 'space-between',
		flexDirection: 'row',
		borderBottomWidth: 1,
		borderBottomColor: '#e6e6e6',
		backgroundColor: 'white',
	},
	invitationContent: {
		padding: 10,
	},
	invitation: {
		flex: 3,
		flexDirection: 'column',
	},
	search: {
		paddingRight: 10,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'flex-end',
		borderBottomWidth: 1,
		borderColor: '#e6e6e6',
		backgroundColor: '#f2f2f2',
	},
})