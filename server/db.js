let envelopes = [{
        name: 'Other',
        saveAmount: 0,
        total: 0,
        id: 0
    }]

    
const addEnvelope = (name, saveAmount, total) =>{
    const objectToPush = {
        name: name,
        saveAmount: saveAmount,
        total: total ? total : 0,
        id: envelopes.length
    }
    envelopes.push(objectToPush);
    return envelopes[envelopes.length-1];
}


const getEnvelopes = () => {
    return envelopes;
}

const getEnvelopeById = (id) => {
    const envelope = envelopes.filter(env =>{
        return env.id === id;
    })
    return envelope;
}

const getIndexById = (id) => {
    
    for (let i=0; i<envelopes.length; i++){
        if (envelopes[i].id === id){
            return i;
        }
    }
    return -1;

}

const updateEnvelopeById = (id, name, saveAmount, total) => {
    const index = getIndexById(id);
    envelopes[index].name = name;
    envelopes[index].saveAmount = saveAmount;
    envelopes[index].total = total;

    return envelopes[index];
}

const deleteEnvelopeById = (id) => {
    const index = getIndexById(id);

    if (index === -1 ){
        return false
    }

    envelopes.splice(index, 1);
    console.log(envelopes);
    return true;
}

module.exports = {
    addEnvelope,
    getEnvelopes,
    getEnvelopeById,
    updateEnvelopeById,
    deleteEnvelopeById
};