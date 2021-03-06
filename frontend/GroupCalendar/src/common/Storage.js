'user strict';

import React, {Component} from 'react';
import {AsyncStorage} from 'react-native';

export default class Storage extends Component {

    static async getSignInByGoogle() {
        try{
            let ret = await AsyncStorage.getItem('signInByGoogle', null);
            return ret;
        } catch (error) {
            throw error;
        }
    }

    //get profile project from async storage
    static async getProfile() {
        let ret = null;
        try {
            let profile = await AsyncStorage.getItem('profile');
            if (profile) {
                ret = JSON.parse(profile);
            }
            return ret;
        } catch(error) {
            throw error;
        }
    }

    static async getAllProjects() {
        let ret = null;
        try {
            let project = await AsyncStorage.getItem('project');
            if (project) {
                ret = JSON.parse(project);
            }
            return ret;
        } catch (error) {
            throw error;
        }
    }

    static async getProjectList() {
        let ret = null;
        try {
            let projectList = await AsyncStorage.getItem('projectList');
            if (projectList) {
                ret = JSON.parse(projectList);
            }
            return ret;
        } catch(error) {
            throw error;
        }
    }

    static async getInvitationList() {
        let ret = null;
        try {
            let invitationList = await AsyncStorage.getItem('invitationList');
            if (invitationList) {
                ret = JSON.parse(invitationList);
            }
            return ret;
        } catch(error) {
            throw error;
        }
    }

    static async getAllInvitations() {
        let ret = null;
        try {
            let allInvitations = await AsyncStorage.getItem('allInvitations');
            if (allInvitations) {
                ret = JSON.parse(allInvitations);
            }
            return ret;
        } catch (error) {
            throw error;
        }
    }

    static async setAllProjects(project) {
        try {
            await AsyncStorage.setItem('project',
                JSON.stringify(project));
        } catch (error) {
            throw error;
        }
    }

    static async setAllInvitations(allInvitations) {
        try {
            await AsyncStorage.setItem('allInvitations',
                JSON.stringify(allInvitations));
        } catch (error) {
            throw error;
        }
    }

    static async setProjectList(projectList) {
        try {
            await AsyncStorage.setItem('projectList',
                JSON.stringify(projectList));
        } catch (error) {
            throw error;
        }
    }
    //set profile object
    static async setProfile(profile) {
        try {
            await AsyncStorage.setItem('profile',
                JSON.stringify(profile));
        } catch (error) {
            throw error;
        }
    }

    static async setSignInByGoogle(flag) {
        try {
            await AsyncStorage.setItem('signInByGoogle',flag);
        } catch (error) {
            throw error;
        }
    }

    static async setInvitationList(invitationList) {
        try {
            await AsyncStorage.setItem('invitationList', 
                JSON.stringify(invitationList));
        } catch (error) {
            throw error;
        }
    }


    //clean all storages
    static async deleteAll() {
        try {
            await AsyncStorage.removeItem('projectList');
            await AsyncStorage.removeItem('project');
            await AsyncStorage.removeItem('profile');
            await AsyncStorage.removeItem('signInByGoogle');
            await AsyncStorage.removeItem('allInvitations');
            await AsyncStorage.removeItem('invitationList');
        } catch (error) {
            throw error;
        }
    }
}