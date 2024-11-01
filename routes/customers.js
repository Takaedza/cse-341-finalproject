const express = require('express');
const router = express.Router();
const controller = require('../controllers/customers');
const validation = require('../middleware/validate');
const { isAuthenticated } = require('../middleware/authenticate');

// Add isAuthenticated to all routes after testing

//Get all customers
router.get('/', controller.getAllCustomers);

//Get customer by ID
router.get('/:id', isAuthenticated, validation.checkID, controller.getCustomer);

// Add new customer
router.post(
	'/',
	isAuthenticated,
	validation.customerDataValidation,
	controller.addCustomer
);

// Update customer by ID
router.put(
	'/:id',
	isAuthenticated,
	validation.checkID,
	validation.customerDataValidation,
	controller.updateCustomerByID
);

// Add credit or to be read book
router.post(
	'/add',
	isAuthenticated,
	validation.validateAddRemove,
	validation.checkAddRemoveIDs,
	controller.addBookArray
);

// Remove credit or to be read book
router.post(
	'/remove',
	isAuthenticated,
	validation.validateAddRemove,
	validation.checkAddRemoveIDs,
	controller.removeBookFromArray
);

// Remove customer by ID
router.delete(
	'/:id',
	isAuthenticated,
	validation.checkID,
	controller.deleteCustomer
);

module.exports = router;
