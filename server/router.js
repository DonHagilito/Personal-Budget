const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const {
  addEnvelope,
  getEnvelopes,
  getEnvelopeById,
  updateEnvelopeById,
  deleteEnvelopeById
} = require('./db.js')

router.use(bodyParser.json());

router.get('/', (req, res, next) =>{
    res.sendFile(__dirname + '/public/index.html');
})

router.get('/style.css', function(req, res) {
    res.sendFile(__dirname + "/public/style.css");
  });

router.get('/api/envelopes', function(req, res) {
    const envelopes = getEnvelopes();
    res.send(envelopes);
});

router.post('/api/envelope', (req, res, next) => {
  const body = req.body
  const addedEnvelope = addEnvelope(body.name, body.saveAmount, body.total)

  res.send(addedEnvelope);
})

router.get('/api/envelopes/:id', (req, res, next) =>{
  const id = parseInt(req.params.id);
  const envelope = getEnvelopeById(id);

  res.send(envelope);
})

router.put('/api/envelopes/:id', (req, res, next) => {
  const id = parseInt(req.params.id);
  const body = req.body;

  const updatedEnvelope = updateEnvelopeById(id, body.name, body.saveAmount, body.total);
  res.send(updatedEnvelope);

})

router.delete('/api/envelopes/:id', (req, res, next) => {
  const id = parseInt(req.params.id);

  const result = deleteEnvelopeById(id);
  if (result){
    res.status(204).send();
  } else{
    res.status(404).send();
  }

})


module.exports = router;
