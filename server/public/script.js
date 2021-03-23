const savingsField = document.getElementById('total-savings')
const categoryTable = document.getElementById('categories-table');


const getTotalSavings = async () => {
    const response = await fetch('/api/total-savings');
    if (response.ok){
        const jsonResponse = await response.json();
        console.log(jsonResponse);
        savingsField.value = jsonResponse.totalSavings;
    }
}


const getJsonResponse = async (url) => {
    const response = await fetch(url);
    try{
        if (response.ok){
            const jsonResponse = await response.json();
            console.log(jsonResponse);
            return jsonResponse;
        }
    } catch(err){
        console.log(err);
    }
}

const onStartUp = async () =>{
    envelopeUrl = 'api/envelopes';
    
    jsonResponse = await getJsonResponse(url);
    let loopIndex = 1;
    
    jsonResponse.forEach(env => {
        let row = categoryTable.insertRow(loopIndex);
        row.id = env.id;
        let cell1 = row.insertCell(0);
        let cell2 = row.insertCell(1);
        let cell3 = row.insertCell(2);
        cell1.innerHTML = `${env.name}`;
        cell2.innerHTML = `<input type="text" id="${env.name}" name="${env.name}" value="${env.saveAmount}" size="5px" readonly>`;
        cell3.innerHTML = `${env.total}`;
        
        loopIndex++;
    })
}

getTotalSavings();
onStartUp();