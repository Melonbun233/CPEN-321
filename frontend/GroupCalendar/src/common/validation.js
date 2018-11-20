
//this constraint is used for all validations
export const signUpConstraints = {
	//check this is a email
	email: {
		presence: true,
		email: {
			message: 'invalid email address',
		},
	},
	firstname: {
		presence: {
			allowEmpty: false,
		},
	},
	//first or last name
	lastname: {
		presence: {
			allowEmpty: false,
		},
	},
	//check password
	password: {
		presence: true,
		length: {
			minimum: 6,
			maximum: 14,
			tooLong: 'maximum length is 14',
			tooShort: 'minimum length is 6',
		},
	},
};