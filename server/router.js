const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const {
  addEnvelope,
  getEnvelopes,
  getEnvelopeById,
  updateEnvelopeById,
  deleteEnvelopeById,
  addSavings,
  spendMoney,
  getTotalSavings,
  getNonEnvelopeSavings,
  transferBetweenEnvelopes
} = require('./db.js')

router.use(bodyParser.json());

router.get('/', (req, res, next) =>{
    res.sendFile(__dirname + '/public/index.html');
})

router.get('/style.css', function(req, res) {
    res.sendFile(__dirname + "/public/style.css");
  });

  router.get('/script.js', function(req, res) {
    res.sendFile(__dirname + "/public/script.js");
  });

router.get('/api/envelopes', function(req, res) {
    const envelopes = getEnvelopes();
    res.send(envelopes);
});

router.get('/api/total-savings', (req, res, next) =>{
  const totalSavings = getTotalSavings();
  res.send({totalSavings});
})

router.get('/api/non-envelope-savings', (req, res, next) =>{
  const nonEnvelopeSavings = getNonEnvelopeSavings();
  res.send({nonEnvelopeSavings});
})

router.post('/api/envelope', (req, res, next) => {
  const body = req.body
  const addedEnvelope = addEnvelope(body.name, body.saveAmount, body.total)

  res.status(201).send(addedEnvelope);
})

router.post('/api/transfer/:from/:to', (req, res, next) => {
  const fromId = parseInt(req.params.from);
  const toId = parseInt(req.params.to);
  const amount = req.body.amount

  const arrWithUpdatedEnv = transferBetweenEnvelopes(fromId, toId, amount);

  res.send({arrWithUpdatedEnv});
})

router.get('/api/envelopes/:id', (req, res, next) =>{
  const id = parseInt(req.params.id);
  const envelope = getEnvelopeById(id);

  if (envelope === -1){
    res.status(404).send('ID not found!');
  } else{
    res.send(envelope);
  }
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

router.put('/api/salary', (req, res, next) => {
  const totalSavings = addSavings(req.body.salary);
  if (totalSavings){ 
    res.status(200).send({totalSavings});
  } else{
    res.status(500).send();
  }
})

router.put('/api/spend/:id', (req, res, next) => {
  const amount = req.body.amount;
  const id = parseInt(req.params.id);
  const newTotal = spendMoney(amount, id);

  res.send({newTotal})
})

router.use((err, req, res, next) =>{
  const status = err.status || 500;
  res.status(status).send(err.message)
})


module.exports = router;
