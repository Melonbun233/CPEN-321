var Project = require('../models/project');
var User = require('../models/user');
var Mail = require('./mailController');

async function putEventOwner (req, res) {
	try{
		if ( !(await Project.isOwner(req.body.projectId, req.body.userId)) ){
			return res.status(400).json({"error":"user is not owner"});
		}
	} catch (error) {
		return res.status(400).json({error});
	}

	try{
		await Project.putEventOwner(req.body.eventId, req.body.update);
		res.status(200).json();
	} catch (error) {
		res.status(400).json({error});
	}
}

// return eventId[]
async function createEvents (req, res){
	try{
		if ( !(await Project.isOwner(req.body.projectId, req.body.userId)) ){
			return res.status(400).json({"error":"user is not owner"});
		}
	} catch (error) {
		return res.status(400).json({error});
	}

	var eventId;
	try{
		eventId = await Project.createEvents(req.body.projectId, req.body.event);
		res.status(200).json({eventId});
	} catch (error) {
		res.status(403).end();
	}
}

async function deleteEvents (req, res){
	try{
		if ( !(await Project.isOwner(req.body.projectId, req.body.userId)) ){
			return res.status(400).json({"error":"user is not owner"});
		}
	} catch (error) {
		return res.status(400).json({error});
	}
	
	try{
		await Project.deleteEvents(req.body.eventId);
		res.status(200).json();
	} catch (error) {
		res.status(403).end();
	}
}


async function getProject (req, res) {
	var projectId = req.param('projectId');
	var userId = req.param('userId');

	// try{
	// 	if ( !(await Project.isUserInProject(projectId, userId)) ){
	// 		return res.status(400).json({"error":"user is not in project"});
	// 	}
	// } catch (error) {
	// 	return res.status(400).json({error});
	// }

	/* get project */
	var project;
	var events;
	var memberId;
	try{
		project = await Project.getProject(projectId);
		events = await Project.getEvents(projectId);
		memberId = await Project.getMemberId(projectId);
	} catch (error) {
		console.log(error);
		return res.status(403).end();
	}

	/* add events to json project */
	project.events = events;
	project.memberId = memberId;

	res.status(200).json({project});
}

async function putProject(req, res){
	try{
		if ( !(await Project.isOwner(req.body.projectId, req.body.userId)) ){
			return res.status(400).json({"error":"user is not owner"});
		}
	} catch (error) {
		return res.status(400).json({error});
	}


	try{
		await Project.putProject(req.body.projectId, req.body.update);
		res.status(200).json();
	} catch (error) {
		res.status(403).end();
	}
}

async function createProject (req, res){
	try{
		var projectId = await Project.createProject(req.body.project, req.body.userId);
		res.status(200).json({projectId});
	} catch (error){
		res.status(403).end();
	}
}

async function deleteProject (req, res){
	try{
		if ( !(await Project.isOwner(req.body.projectId, req.body.userId)) ){
			return res.status(400).json({"error":"user is not owner"});
		}
	} catch (error) {
		return res.status(400).json({error});
	}

	try{
		await Project.deleteProject(req.body.projectId);
		res.status(200).json();
	} catch (error) {
		res.status(403).end();
	}
}

 async function addEventMember (req, res){
 	var projectId = req.body.projectId;
 	var userId = req.body.userId;
 	var eventIds = req.body.eventId;
 	var isValidMember;
 	// console.log(projectId);
 	// console.log(userId);
 	// console.log(eventIds);

 // 	try {
 // 		await Project.isUserInProject(projectId, userId);
 // 	} catch (error) {
 // 		console.log(error);
 // return res.status(403).end();
 // 	}

	// // this part is optional if owner could vote
	// try {
	// 	isValidMember = !(await Project.isOwner2(projectId, userId));
	// } catch (error) {
	// 	console.log(error);
	// return res.status(403).end();
	// }

	try {
		isValidMember = await Project.isUserInProject2(projectId, userId);
	} catch (error) {
		console.log(error);
		return res.status(403).end();
	}


	if(!isValidMember) {
		return res.status(400).send('This user is not a valid member');
	}

	// try{
	// 	if(await Project.isUserInEvents(eventIds, userId)){
	// 		return res.status(400).send('This user has already been in the event')
	// 	}
	// }	catch (error) {
	// 	res.status(403).end();
	// }

	try {
		var unrolledEvents = await Project.addUserInEvents(projectId, eventIds, userId);
	} catch (error) {
		console.log(error);
		return res.status(403).end();
	}

	if (unrolledEvents.length == 0){
		return res.status(200).json({unrolledEvents});
	}

	return res.status(202).json({unrolledEvents});
	

}

async function deleteEventMember (req, res){
	var projectId = req.body.projectId;
	var userId = req.body.userId;
	var eventIds = req.body.eventId;
	var isValidMember;

	try {
		isValidMember = await Project.isUserInProject2(projectId, userId);
	} catch (error) {
		console.log(error);
		return res.status(403).end();
	}

	if(!isValidMember) {
		return res.status(400).send('This user is not a valid member');
	}

	try {
		await Project.deleteUserInEvents(projectId, eventIds, userId);
	} catch (error) {
		console.log(error);
		return res.status(403).end();
	}

	return res.status(200).json();

}

async function deleteEventMemberAll (req, res){
	var projectId = req.body.projectId;
	var userId = req.body.userId;
	var isValidMember;

	try {
		isValidMember = await Project.isUserInProject2(projectId, userId);
	} catch (error) {
		console.log(error);
		return res.status(403).end();
	}

	if(!isValidMember) {
		return res.status(400).send('This user is not a valid member');
	}

	try {
		await Project.deleteUserInEventsAll(projectId, userId);
	} catch (error) {
		console.log(error);
		return res.status(403).end();
	}

	return res.status(200).json();

}


async function inviteUser (req, res){
	var projectId = req.body.projectId;
	var userId = req.body.userId;
	var invitedEmail = req.body.invitedEmail;
	var invitedId;

	console.log(invitedEmail);

	//this part is optional
	try {
		if(!(await Project.isOwner2(projectId, userId))){
			console.log('Only Project Owner can invite');
			return res.status(403).send('Only Project Owner can invite');
		}
	} catch (error) {
		console.log(error);
		return res.status(403).end();
	}

	try{
		var result = await User.getInfo(invitedEmail);
	} catch (error) {
		console.log(error);
		return res.status(403).end();
	}

	if (result == null){
		console.log('Could not find the user');
		return res.status(404).send('Could not find the user');
	}
	var invitedId = result.userId;

	if(invitedId == userId){
		console.log('Could not invite yourself');
		return res.status(400).send('Could not invite yourself');
	}
	try {
		if(await Project.isUserInInviteList(projectId, invitedId)){
			console.log('Invited user has been in the InviteList');
			return res.status(302).send('Invited user has been in the InviteList');;
		}
	} catch (error) {
		console.log(error);
		return res.status(403).end();
	}
	
	try {
		if(await Project.isUserInProject2(projectId, invitedId)){
			console.log('Invited user has been in the project');
			return res.status(302).send('Invited user has been in the project');
		}
	} catch (error) {
		console.log(error);
		return res.status(403).end();
	}

	try {
		await Project.addUserInInviteList(projectId, invitedId);
	} catch (error) {
		console.log(error);
		return res.status(403).end();
	}

	// send email to notify

	// try{
	// 	var invitor = await User.getProfile(userId);
	// } catch (error) {
	// 	console.log(error);
	// 	return res.status(403).end();
	// }

	// var userName = `${invitor.userFirstName} ${invitor.userLastName}`;

	try{
		var invitedProject = await Project.getProject(projectId);
	} catch (error) {
		console.log(error);
		return res.status(403).end();
	}

	var projectName = `${invitedProject.projectName}`;

	var receiver = invitedEmail;
	var subject = '[Group Calendar]: New Project Invitation';
	var text = `You are invited into the Project: "${projectName}". \nOpen the app and check it!`;
	Mail.sendEmail(receiver, subject, text, text);

	return res.status(200).json();

}

async function deleteInvitedUser (req, res){
	
	var projectId = req.body.projectId;
	var userId = req.body.userId;
	var invitedId = req.body.invitedId;

	//this part is optional
	try {
		if(!(await Project.isOwner2(projectId, userId))){
			return res.status(403).send('Only Project Owner can delete invited user');
		}
	} catch (error) {
		console.log(error);
		return res.status(403).end();
	}

	// try{
	// 	var result = await User.getInfo(invitedEmail);
	// } catch (error) {
	// 	console.log(error);
	// return res.status(403).end();
	// }

	// if (result == null){
	// 		return res.status(400).send('Could not find the user');
	// 	}
	// var invitedId = result.userId;

	try {
		if(!(await Project.isUserInInviteList(projectId, invitedId))){
			return res.status(404).send('This user is not in the InvitedList');
		}
	} catch (error) {
		console.log(error);
		return res.status(403).end();
	}

	try {
		await Project.deleteUserInInviteList(projectId, userId);
	} catch (error) {
		console.log(error);
		return res.status(403).end();
	}

	return res.status(200).json();

}


async function deleteMembers(req, res){
	try {
		if(!(await Project.isUserInProject(req.body.projectId, req.body.userId))){
			return res.status(400).send('user not in project');
		}
	} catch (error) {
		console.log(error);
		return res.status(400).end();
	}
	
	try{
		await Project.deleteMembers(req.body.projectId, req.body.memberId);
		res.status(200).end();
	} catch (error) {
		console.log(error);
		res.status(403).end();
	}
}


module.exports = {
	putEventOwner,
	createEvents,
	deleteEvents,
	getProject,
	putProject,
	createProject,
	deleteProject,
	deleteMembers,

	addEventMember,
	deleteEventMember,
	deleteEventMemberAll,
	inviteUser,
	deleteInvitedUser,
	
}