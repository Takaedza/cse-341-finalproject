const validator = require('../helpers/validate');
const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;



const isValidDate = (dateString) => {
	const regex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])\/\d{4}$/; // Matches MM/DD/YYYY format
	if (!regex.test(dateString)) {
		return false;
	}
	const date = new Date(dateString);
	return date instanceof Date && !isNaN(date);
};

const validateCredit = async (req, res, next) => {
	const validationRule = {
		customerID: 'required|string',
		orderID: 'required|string',
		startDate: 'required|string',
		endDate: 'required|string',
	};

	validator.validator(req.body, validationRule, {}, async (err, status) => {
		if (!status) {
			return res.status(412).send({
				success: false,
				message: 'Validation failed',
				data: err,
			});
		}

		// Check if startDate and endDate are valid dates in MM/DD/YYYY format
		if (!isValidDate(req.body.startDate) || !isValidDate(req.body.endDate)) {
			return res.status(400).send({
				success: false,
				message: 'Invalid date format for startDate or endDate. Expected format: MM/DD/YYYY.',
			});
		}

		try {
			// Check if member exists
			const customer = await mongodb
				.getDatabase()
				.db()
				.collection('customers')
				.findOne({ _id: new ObjectId(req.body.customerID) });

			if (!customer) {
				return res.status(404).send({
					success: false,
					message: 'No User is Available.',
				});
			}

			// Check if order exists and has available copies
			const order = await mongodb
				.getDatabase()
				.db()
				.collection('orders')
				.findOne({ _id: new ObjectId(req.body.orderID) });

			if (!order) {
				return res.status(404).send({
					success: false,
					message: 'Order is not available.',
				});
			}

			if (order.availableCopies <= 0) {
				return res.status(400).send({
					success: false,
					message: 'Order is not available.',
				});
			}

			next(); // All validations passed
		} catch (dbError) {
			return res.status(500).send({
				success: false,
				message: 'Error validating credit data.',
				data: dbError.message,
			});
		}
	});
};


const saveContact = (req, res, next) => {
	const validationRule = {
		name: 'required|string',
		trevor: 'string',
		farrow: 'string',
		attic: 'string',
		stoc: 'string',
		paint: 'string',
		saviour: 'string',
		acrylic: 'string',
		deeper: 'string',
	};
	validator.validator(req.body, validationRule, {}, (err, status) => {
		if (!status) {
			res.status(412).send({
				success: false,
				message: 'Validation failed',
				data: err,
			});
		} else {
			next(); // goes to contactsController.updateContact en routes/contacts.
		}
	});
};

const customerDataValidation = (req, res, next) => {
	const validationRule = {
		firstName: 'required|string',
		lastName: 'required|string',
		email: 'required|email',
		dob: 'required|date',
		accountType: 'required|string|in:member,librarian',
		credits: 'array',
		'credits.*': 'string',
		orderPeriod: 'array',
		'orderPeriod.*': 'string',
	};
	validator.validator(req.body, validationRule, {}, (err, status) => {
		if (!status) {
			res.status(412).send({
				success: false,
				message: 'Validation failed',
				data: err,
			});
		} else {
			next();
		}
	});
};

async function checkID(req, res, next) {
	try {
		const ID = new ObjectId(req.params.id);
		const validDocument = await validator.getOneByID(ID);
		if (validDocument.length < 1) {
			res.status(412).send({
				success: false,
				message: 'Validation failed',
				data: 'Invalid ID - ID not found',
			});
		} else {
			next();
		}
	} catch {
		res.status(400).send({
			success: false,
			message: 'Validation failed',
			data: 'Invalid ID format',
		});
	}
}

async function validateAddRemove(req, res, next) {
	const validationRule = {
		customerID: 'required|string',
		listType: 'required|string|in:toBeRead,loans',
		itemID: 'required|string',
	};
	validator.validator(req.body, validationRule, {}, (err, status) => {
		if (!status) {
			res.status(412).send({
				success: false,
				message: 'Validation failed',
				data: err,
			});
		} else {
			next();
		}
	});
}

async function checkAddRemoveIDs(req, res, next) {
	try {
		const customerID = new ObjectId(req.body.customerID);
		const itemID = new ObjectId(req.body.itemID);
		const validItem = await validator.getOneByID(itemID);
		const validMember = await validator.getOneByID(memberID);
		if (validItem.length < 1 && validMember.length < 1) {
			res.status(412).send({
				success: false,
				message: 'Validation failed',
				data: 'Invalid IDs - IDs not found',
			});
		} else {
			next();
		}
	} catch {
		res.status(400).send({
			success: false,
			message: 'Validation failed',
			data: 'Invalid ID format',
		});
	}
}

async function productValidation(req, res, next) {
	const validationRule = {
		productName: 'required|string',
		coverage: 'string',
		quality: 'required|string',
		orderid: 'required|string'
	};
	validator.validator(req.body, validationRule, {}, (err, status) => {
		if (!status) {
			res.status(412).send({
				success: false,
				message: 'Validation failed',
				data: err,
			});
		} else {
			next();
		}
	});
}

module.exports = {
	saveContact,
	customerDataValidation,
	checkID,
	validateAddRemove,
	checkAddRemoveIDs,
	validateCredit,
	productValidation
};
