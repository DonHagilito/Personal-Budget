let envelopes = [{
        name: 'Rent',
        saveAmount: 5000,
        total: 500,
        id: 0
    },
    {
        name: 'Food',
        saveAmount: 3000,
        total: 500,
        id: 1
    },
    {
        name: 'Clothes',
        saveAmount: 800,
        total: 50,
        id: 2
    }]
let totalSavings = 0;
let nonEnvelopeSavings = 0;
let lastIdUsed = envelopes.length;
    
    
const addEnvelope = (name, saveAmount, total) =>{
    if( typeof name === 'string' && typeof saveAmount === 'number' && typeof total ==='number'){
        const objectToPush = {
            name: name,
            saveAmount: saveAmount,
            total: total ? total : 0,
            id: lastIdUsed
        }
        lastIdUsed++;
        envelopes.push(objectToPush);
        return envelopes[envelopes.length-1];
    } else {
        const error = new Error('Not all keys are present!');
        error.status = 400;
        throw error;
    }
}


const getEnvelopes = () => {
    return envelopes;
}

const getTotalSavings = () => {
    updateTotalSavings();
    return totalSavings;
}

const getNonEnvelopeSavings = () => {
    return nonEnvelopeSavings;
}

const getEnvelopeById = (id) => {
    const envelope = envelopes.filter(env =>{
        return env.id === id;
    })
    if (envelope.length>0){
        return envelope[0];
    } else{
        return -1;
    }
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
    if( typeof name === 'string' && typeof saveAmount === 'number' && typeof total ==='number'){
        const index = getIndexById(id);
         if (index === -1){
             const error = new Error('ID not found!');
             error.status = 404
             throw error;
         }
        envelopes[index].name = name;
        envelopes[index].saveAmount = saveAmount;
        envelopes[index].total = total;
        return envelopes[index];
    } else {
        const error = new Error('Not all keys are present!');
        error.status = 400;
        throw error;
    }
    
}

const deleteEnvelopeById = (id) => {
    const index = getIndexById(id);

    if (index === -1 ){
        return false
    }

    envelopes.splice(index, 1);
    return true;
}

const addSavings = (salary) => {

    let salaryMinimum = 0;
     envelopes.forEach(env => {
        salaryMinimum +=env.saveAmount;
    })

    if(salary < salaryMinimum) {
        const error = new Error('Salary too little to fill the envelopes');
        error.status = 400;
        throw error;
    }

    envelopes.forEach(env =>{
        env.total += env.saveAmount;
    })
    nonEnvelopeSavings += salary-salaryMinimum;

    updateTotalSavings();

    return totalSavings;
}

const updateTotalSavings = () =>{
    let envTotal = 0;
    envelopes.forEach(env => {
        envTotal += env.total;
    })
    totalSavings = envTotal + nonEnvelopeSavings;
}

const spendMoney = (amount, envelopeId) => {
    const index = getIndexById(envelopeId);
    if (index === -1){
        const error = new Error('ID not found!');
        error.status = 404;
        throw error;
    }
    if (envelopes[index].total < amount){
        const error = new Error('Saved amount is less than spend amount!');
        error.status = 400;
        throw error;
    }
    envelopes[index].total -= amount
    updateTotalSavings();
    return envelopes[index].total
}

const transferBetweenEnvelopes = (fromId, toId, amount) => {
    const fromIndex = getIndexById(fromId);
    const toIndex = getIndexById(toId);
    if (fromIndex === -1 || toIndex === -1 ){
        const error = new Error('ID not found!');
        error.status = 404;
        throw error; 
    }
    if (envelopes[fromIndex].total < amount){
        const error = new Error('Saved amount is less than spend amount!');
        error.status = 400;
        throw error;
    }

    envelopes[fromIndex].total -= amount;
    envelopes[toIndex].total += amount;

    return [envelopes[fromIndex], envelopes[toIndex]];
}

const updateNonEnvelopeMoney = (newAmount) => {
    if ((newAmount > nonEnvelopeSavings && typeof newAmount === "number") || newAmount < 0){
        const error = new Error('Not enough funds!');
        error.status = 400;
        throw error; 
    }
    nonEnvelopeSavings = newAmount;
    updateTotalSavings();
    return newAmount;
}


module.exports = {
    addEnvelope,
    getEnvelopes,
    getEnvelopeById,
    updateEnvelopeById,
    deleteEnvelopeById,
    addSavings,
    spendMoney,
    getTotalSavings,
    getNonEnvelopeSavings,
    transferBetweenEnvelopes,
    updateNonEnvelopeMoney
};