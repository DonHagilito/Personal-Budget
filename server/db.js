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
        id: 0
    }
    envelopes.push(objectToPush);
    return envelopes[envelopes.length-1];
}


const getEnvelopes = () => {
    console.log(envelopes);
    return envelopes;
}

module.exports = {
    addEnvelope,
    getEnvelopes
};