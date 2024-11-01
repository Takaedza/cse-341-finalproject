const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

const getAllCustomers = async (req, res) => {
	//#swagger.tags=['Customers']
	try {
		const result = await mongodb
			.getDatabase()
			.db()
			.collection('customers')
			.find();
		result.toArray().then((lists) => {
			res.setHeader('Content-Type', 'application/json');
			res
				.status(200)
				.json({ message: 'Customers retrieved successfully!', data: lists });
		});
	} catch (err) {
		console.error('Error retrieving customers:', err); // Add detailed logging
		res.status(500).json({ message: err.message });
	}
};

const getCustomer = async (req, res) => {
	//#swagger.tags=['Customers']
	try {
		const ID = new ObjectId(req.params.id);
		const result = await mongodb
			.getDatabase()
			.db()
			.collection('customers')
			.find({ _id: ID });
		result.toArray().then((lists) => {
			res.setHeader('Content-Type', 'application/json');
			res.status(200).json(lists);
		});
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

// Add a new customer
async function addCustomer(req, res) {
	//#swagger.tags=['Customers']
	try {
		const newCustomer = {
			firstName: req.body.firstName,
			lastName: req.body.lastName,
			email: req.body.email,
			dob: req.body.dob,
			accountType: req.body.accountType,
			credits: req.body.credits,
			orderPeriod: req.body.orderPeriod,
		};
		const result = await mongodb
			.getDatabase()
			.db()
			.collection('customers')
			.insertOne(newCustomer);
		res
			.status(200)
			.json({ message: 'New customer added', customerID: result.insertedId });
	} catch (error) {
		console.error('Error adding new customer:', error);
		res.status(500).json({ message: 'Failed to add new customer' });
	}
}

// Update a single order placement by ID
async function updateCustomerByID(req, res) {
	//#swagger.tags=['Customers']
	try {
		const ID = new ObjectId(req.params.id);
		const updatedInfo = {
			firstName: req.body.firstName,
			lastName: req.body.lastName,
			email: req.body.email,
			dob: req.body.dob,
			accountType: req.body.accountType,
			credits: req.body.credits,
			orderPeriod: req.body.orderPeriod,
		};
		const result = await mongodb
			.getDatabase()
			.db()
			.collection('customers')
			.updateOne({ _id: ID }, { $set: updatedInfo });
		res.status(200).json('Customer Updated');
	} catch (error) {
		console.error('Error updating customer:', error);
		res.status(500).json({ message: 'Failed to update customer.' });
	}
}

// Delete a single customer by ID
const deleteCustomer = async (req, res) => {
	//#swagger.tags=['Customers']
	const ID = new ObjectId(req.params.id);
	const result = await mongodb
		.getDatabase()
		.db()
		.collection('customers')
		.deleteOne({ _id: ID });
	res.status(200).json('Customer Removed');
};

const addOrderArray = async (req, res) => {
	//#swagger.tags=['Customer']
	try {
		const customerID = new ObjectId(req.body.customerID);
		const listType = req.body.listType;
		const toAddId = req.body.itemID;

		// Fetch the member from the database
		const customer = await mongodb
			.getDatabase()
			.db()
			.collection('customers')
			.findOne({ _id: customerID });

		if (!customer) {
			return res.status(404).json({ message: 'Customer not found' });
		}

		// Update the customer's array
		const result = await mongodb
			.getDatabase()
			.db()
			.collection('customers')
			.updateOne(
				{ _id: memberID },
				{ $push: { [listType]: toAddId } } // Adds the item to the array
			);

		res.status(200).json({ message: 'Item added successfully', customerID });
	} catch (error) {
		console.error('Error adding item:', error);
		res.status(500).json({ message: 'Failed to add item' });
	}
};

const removeOrderFromArray = async (req, res) => {
	//#swagger.tags=['Customers']
	try {
		const customerID = new ObjectId(req.body.customerID);
		const orderID = req.body.itemID; // The order to remove
		const listType = req.body.listType; // Either 'credits' or 'orderPeriod'

		// Fetch the customer from the database
		const customer = await mongodb
			.getDatabase()
			.db()
			.collection('customers')
			.findOne({ _id: customerID });

		if (!customer) {
			return res.status(404).json({ message: 'Customer not found' });
		}

		// Use $pull to remove the order from the specified list (either credits or orderPeriod)
		const result = await mongodb
			.getDatabase()
			.db()
			.collection('customers')
			.updateOne({ _id: customerID }, { $pull: { [listType]: orderID } });

		if (result.modifiedCount === 0) {
			return res.status(404).json({ message: 'order not found in the list' });
		}

		res.status(200).json({
			message: `order removed from ${listType} successfully`,
			customerID,
		});
	} catch (error) {
		console.error('Error removing order:', error);
		res.status(500).json({ message: 'Failed to remove order' });
	}
};

module.exports = {
	getAllCustomers,
	getCustomer,
	addCustomer,
	updateCustomerByID,
	deleteCustomer,
	addOrderArray,
	removeOrderFromArray,
};
