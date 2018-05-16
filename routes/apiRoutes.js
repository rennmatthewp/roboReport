const express = require('express');

const environment = process.env.NODE_ENV || 'development';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);

const router = express.Router();

router.get('/users', (request, response) => {
  database('users').select()
    .then((users) => {
      response.status(200).json(users);
    })
    .catch((error) => {
      response.status(500).json({ error });
    });
});

router.get('/users/:id', (request, response) => {
  const { id } = request.params;
  database('users').where('id', id)
    .then((user) => {
      if (!user[0]) {
        return response.status(404).json({ error: `Could not find user with id ${id}.` })
      }
      return response.status(200).json(user[0]);
    })
    .catch(error => response.status(500).json(error));
});

router.post('/users', (request, response) => {
  const user = request.body;
  const requiredParameters = [
    'firstName',
    'lastName',
    'email',
    'phone',
    'phoneType',
    'address',
    'city',
    'state',
    'zipcode'
  ]

  for (let parameter of requiredParameters) {
    if (!user[parameter]) {
      return response.status(422).json({
        error: `Expected format: {firstName: <String>, lastName: <String>, email: <String>, phone: <String>, phoneType: <String>, address: <String>, city: <String>, state: <String>, zipcode: <String>}. Missing required property ${parameter}.`
      });
    }
  }

  database('users')
    .insert(user, 'id')
    .then((user) => {
      return response.status(201).json({ id: user[0] })
    })
    .catch((error) => {
      return response.status(500).json(error);
    });
});

router.get('/complaints', (request, response) => {
  database('complaints').select()
    .then((complaints) => {
      response.status(200).json(complaints);
    })
    .catch((error) => {
      response.status(500).json({ error });
    });
});

router.get('/complaints/:id', (request, response) => {
  const { id } = request.params;
  database('complaints').where('id', id)
    .then((complaint) => {
      if (!complaint[0]) {
        return response.status(404).json({ error: `Could not find complaint with id ${id}.` })
      }
      return response.status(200).json(complaint[0]);
    })
    .catch(error => response.status(500).json(error));
});

router.post('/complaints', (request, response) => {
  const complaint = request.body;
  const requiredParameters = [
    "user_id",
    "isSoliciting",
    "subject",
    "description",
    "callerIdNumber",
    "callerIdName",
    "date",
    "time",
    "type",
    "altPhone",
    "permissionGranted",
    "businessName",
    "agentName"
  ]

  for (let parameter of requiredParameters) {
    if (complaint[parameter] === undefined) {
      return response.status(422).json({
        error: `Expected format: {user_id: <Integer>, isSoliciting: <String>, subject: <String>, description: <String>, callerIdNumber: <String>, callerIdName: <String>, date: <String>, time: <String>, type: <String>, altPhone: <String>, permissionGranted: <Boolean>, businessName: <String>, agentName: <String>}. Missing required property ${parameter}.`
      });
    }
  }

  database('complaints')
    .insert(complaint, 'id')
    .then((complaint) => {
      return response.status(201).json({ id: complaint[0] })
    })
    .catch((error) => {
      return response.status(500).json(error);
    });
});

module.exports = { router, database };
