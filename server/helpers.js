

const addEnvelope = (user, name, saveAmount, total) =>{
    const objectToPush = {
        name: name,
        saveAmount: saveAmount,
        total: total ? total : 0
    }
    
    this.envelopes.push(objectToPush);
}