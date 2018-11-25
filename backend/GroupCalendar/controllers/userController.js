var User = require('../models/user.js');
var UidG = require('./uuidGenerator.js');

const {validationResult} = require('express-validator/check');

/* /users */
async function userInfoGet (req, res) {
	var info;

	try{ 
		let info = await User.get_info(req.param('userEmail'));
	} catch (error) {
		res.status(404).json({error});
	}

	res.status(200).json(info);
};

async function userUpdate (req, res){
	try {
		await User.updateUser(req.body.userId, req.body.update.userPwd);
		return res.status(200).json();
	} catch (error) {
		return res.status(400).json({error});
	}
};

async function userCreate (req, res) {
	try{
		await User.emailExist(req.body.user.userEmail);
	} catch (error) {
		return res.status(400).json({error});
	}
	
	try{
		var userId = await User.createUser(req.body.user, req.body.profile);
		res.status(200).json({userId});
	} catch (error) {
		return res.status(400).json({ error });
	}

	var uuid = UidG.uuidCreate(req.body.user.email);
	req.session.uuid = uuid;
	
	return;
};

async function userDelete (req, res) {
	try {
		await User.deleteUser(req.body.userId);
		return res.status(200).end();
	} catch (error) {
		return res.status(400).json({error});
	}
}

/*----------------------*/
/*----/users/profiles---*/
async function profileGet (req, res) {
	var profile;
	var invitation;

	try {
		profile = await User.getProfile(req.param('userId'));
		invitation = await User.getInvitation(req.param('userId'));
		profile.invitation = invitation;
		return res.status(200).json({profile});
	} catch (error) {
		return res.status(400).json({error});
	}
}

async function profileUpdate (req, res) {
	try {
		await User.modifyProfile(req.body.userId, req.body.update);
		return res.status(200).end();
	} catch (error) {
		return res.status(400).json({error});
	}
}

async function getProjectId (req, res){
	try{
		var projectId = await User.getProjectId(req.param('userId'));
		console.log(projectId);
		return res.status(200).json({projectId});
	} catch (error) {
		return res.status(400).json({error});
	}
}

async function getNotification (req, res){
	try{
		var projectIds = await User.getInvitingProjects(req.param('userId'));
		return res.status(200).json({projectIds});
	} catch (error) {
		return res.status(400).json({error});
	}
}

module.exports = {
	userInfoGet,
	userUpdate,
	userCreate,
	userDelete,
	profileGet,
	profileUpdate,
	getProjectId,
	
	getNotification
}
