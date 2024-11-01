const Validator = require('validatorjs');
const mongodb = require('../data/database');

const validator = (body, rules, customMessages, callback) => {
  const validation = new Validator(body, rules, customMessages);
  validation.passes(() => callback(null, true));
  validation.fails(() => callback(validation.errors, false));
};

// This will check if the ID returns a valid object
async function getOneByID(ID) {
	const validCustomer = await mongodb
		.getDatabase()
		.db()
		.collection('customers')
		.find({ _id: ID })
		.toArray();

	if (validCustomer.length > 0) {
		return validCustomer;
	}

	const validOrder = await mongodb
		.getDatabase()
		.db()
		.collection('orders')
		.find({ _id: ID })
		.toArray();

  if (validOrder.length > 0) {
	  return validOrder;
  }

  const validProduct = await mongodb
		.getDatabase()
		.db()
		.collection('products')
		.find({ _id: ID })
		.toArray();

	if (validProduct.length > 0) {
		return validProduct;
	}
  
  const validCredit = await mongodb
		.getDatabase()
		.db()
		.collection('credits')
		.find({ _id: ID })
		.toArray();

	if (validCredit.length > 0) {
		return validCredit;
	}
}

module.exports = { validator, getOneByID };