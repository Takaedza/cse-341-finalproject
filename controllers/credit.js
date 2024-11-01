const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

const getAll = async (req, res) => {
  //#swagger.tags=['Credits']
  try {
    const result = await mongodb.getDatabase().db().collection('credits').find();
    const lists = await result.toArray();
    res.setHeader('Content-Type', 'application/json');
    res.json({ message: 'Credits retrieved successfully!', data: lists });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve credits' });
  }
};

const getOne = async (req, res) => {
  //#swagger.tags=['Credits']
  try {
    const creditId = new ObjectId(req.params.id);
    const result = await mongodb.getDatabase().db().collection('credits').find({ _id: creditId });
    const lists = await result.toArray();
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(lists[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve the credit' });
  }
};

const getByCustomerID = async (req, res) => {
  //#swagger.tags=['Credits']
  try {
    const customerID = req.params.customerID;
    const result = await mongodb.getDatabase().db().collection('credits').find({ customerID: customerID });
    const lists = await result.toArray();
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(lists);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve credits by customer ID' });
  }
};

const add = async (req, res) => {
  //#swagger.tags=['Credits']
  try {
    const credit = {
      customerID: req.body.customerID,
      orderID: req.body.orderID,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
    };
    const response = await mongodb.getDatabase().db().collection('credits').insertOne(credit);
    if (response.acknowledged) {
      res.status(201).json({
        message: 'Credit created successfully!',
        data: { insertedId: response.insertedId },
      });
    } else {
      res.status(500).json({ error: 'Some error occurred while creating the credit.' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to create a new credit' });
  }
};

const update = async (req, res) => {
  //#swagger.tags=['Credits']
  try {
    const creditId = new ObjectId(req.params.id);
    const credit = {
      customerID: req.body.customerID,
      orderID: req.body.orderID,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
    };
    const response = await mongodb
      .getDatabase()
      .db()
      .collection('credits')
      .replaceOne({ _id: creditId }, credit);

    if (response.modifiedCount > 0) {
      res.status(204).json({});
    } else {
      res.status(404).json({ error: 'Credit not found or no changes made.' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to update the credit' });
  }
};

const remove = async (req, res) => {
  //#swagger.tags=['Credits']
  try {
    const creditId = new ObjectId(req.params.id);
    const response = await mongodb.getDatabase().db().collection('credits').deleteOne({ _id: creditId });
    if (response.deletedCount > 0) {
      res.status(204).send();
    } else {
      res.status(500).json('Failed to delete the credit.');
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete the credit' });
  }
};

module.exports = {
  getAll,
  getOne,
  getByCustomerID,
  add,
  update,
  remove,
};
