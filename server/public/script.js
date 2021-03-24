const savingsField = document.getElementById('total-savings');
const nonEnvelopeSavingsField = document.getElementById('non-envelope-savings');
const categoryTable = document.getElementById('categories-table');
const salarySubmitButton = document.getElementById('salary-submit');
const spendButton = document.getElementById('spend-button');
const spendField = document.getElementById('spend');
const salarySubmitField = document.getElementById('salary');
const categoriesSubmitButton = document.getElementById('submit-categories');
const newCategory = document.getElementById('category');
const newSavingsAmount = document.getElementById('savings');
const selectCategories = document.getElementById('categories');

const getJsonResponse = async (url) => {
    const response = await fetch(url);
    try{
        if (response.ok){
            const jsonResponse = await response.json();
            return jsonResponse;
        }
    } catch(err){
        console.log(err);
    }
}

const onStartUp = async () =>{
    const envelopeUrl = 'api/envelopes';
    const totalSavings = 'api/total-savings';

    //Getting the total savings amount
    const savingsAmount = await getJsonResponse(totalSavings);
    savingsField.value = savingsAmount.totalSavings;


    //Getting all the categories in the database and adding them to the table on the website.
    const envelopeArr = await getJsonResponse(envelopeUrl);

    addToSpendMoneyList('No-category savings', 'no-category');
    
    let loopIndex = 1;
    envelopeArr.forEach(env => {
        let row = categoryTable.insertRow(loopIndex);
        row.id = env.id;
        let cell1 = row.insertCell(0);
        let cell2 = row.insertCell(1);
        let cell3 = row.insertCell(2);
        cell1.innerHTML = `${env.name}`;
        cell2.innerHTML = `<input type="text" id="${env.name}" name="${env.name}" value="${env.saveAmount}" size="5px" readonly>`;
        cell3.innerHTML = `${env.total}`;
        //Add to the "Spend Money"-category list
        addToSpendMoneyList(env.name, env.id);
        loopIndex++;
    })
}

const updateValues = async () => {
    const envelopeUrl = 'api/envelopes/';
    const totalSavings = 'api/total-savings';
    const nonEnvelopeSavingsUrl = '/api/non-envelope-savings';

    //Getting the total savings amount
    const savingsAmount = await getJsonResponse(totalSavings);
    savingsField.value = savingsAmount.totalSavings;

    //Getting the total non-envelope savings amount
    const nonEnvelopeSavings = await getJsonResponse(nonEnvelopeSavingsUrl);
    nonEnvelopeSavingsField.value = nonEnvelopeSavings.nonEnvelopeSavings;
    
    
    //Updating envelope values with the help of their ID
    const rowsCount = categoryTable.rows.length;
    for(i=1; i<rowsCount-1; i++){
        let row = categoryTable.rows[i];
        let id = row.id
        let envelope = await getJsonResponse(envelopeUrl+id);
        row.cells[0].innerHTML = `${envelope.name}`;
        row.cells[1].value = envelope.saveAmount;
        row.cells[2].innerHTML = `${envelope.total}`;
    }
}

const postEnvelope = async (name, saveAmount) => {
    const url = 'api/envelope';
    
    const objectToPost = {
        name: name,
        saveAmount: parseInt(saveAmount),
        total: 0
    }
    try{
       
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            mode: 'cors',
            body: JSON.stringify(objectToPost),
        });

        if (response.ok){

            const jsonResponse = await response.json();

            return jsonResponse;
        }
    } catch(err){
        console.log(error);
    }
}

const appendEnvelope = async (env) => {
    const rowsCount= categoryTable.rows.length;
    let row = categoryTable.insertRow(rowsCount-1);
    row.id = env.id;
    let cell1 = row.insertCell(0);
    let cell2 = row.insertCell(1);
    let cell3 = row.insertCell(2);
    cell1.innerHTML = `${env.name}`;
    cell2.innerHTML = `<input type="text" id="${env.name}" name="${env.name}" value="${env.saveAmount}" size="5px" readonly>`;
    cell3.innerHTML = `${env.total}`;
    addToSpendMoneyList(env.name, env.id);
}

const addToSpendMoneyList = (name, id) => {
    let opt = document.createElement('option');
    opt.value = name.toLowerCase();
    opt.id = 'opt'+ id.toString();
    opt.text = name;

    selectCategories.appendChild(opt);
}

salarySubmitButton.onclick = async() =>{
    const url = 'api/salary';
    const amount = salarySubmitField.value;
    

    const objectToPost = {
        salary: amount
    }

    try{
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            mode: 'cors',
            body: JSON.stringify(objectToPost),
        });

        if (response.ok){

            const jsonResponse = await response.json();
            savingsField.value = jsonResponse.totalSavings;
            await updateValues();
            return jsonResponse;
        }
    } catch(err){
        console.log(err);
    }
}

categoriesSubmitButton.onclick = async () =>{
    const name = newCategory.value;
    const saveAmount = newSavingsAmount.value;

    const response = await postEnvelope(name, saveAmount);
    
    appendEnvelope(response);
}

spendButton.onclick = async () => {
    const dropdown = selectCategories;
    const selectedOption = dropdown.options[dropdown.selectedIndex].id.slice(3); //slice away the 'opt' in front of ID.
    const spendAmount = parseInt(spendField.value);


    if (selectedOption === 'no-category'){
        let url = 'api/non-envelope-savings';
        const nonCategorySavings = nonEnvelopeSavingsField.value;
    
        const newAmount = nonCategorySavings-spendAmount;
        const objectToPost = {nonEnvelopeSavings: newAmount};
    
        try{
            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                mode: 'cors',
                body: JSON.stringify(objectToPost),
            });
    
            if (response.ok){
                const jsonResponse = await response.json();
                await updateValues();
                return jsonResponse;
            }
        } catch(err){
            console.log(err);
        }
    } else{
        const id = selectedOption;
        const spendingCategory = document.getElementById(id);
        let url = 'api/envelopes/' + id;
        const currentSavings = parseInt(spendingCategory.cells[2].innerHTML);
    
        const newAmount = currentSavings-spendAmount;
        const objectToPost = {
            name: spendingCategory.cells[0].innerHTML,
            saveAmount: parseInt(spendingCategory.cells[1].value),
            total: newAmount
            };

        try{
            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                mode: 'cors',
                body: JSON.stringify(objectToPost),
            });
    
            if (response.ok){
                const jsonResponse = await response.json();
                await updateValues();
                return jsonResponse;
            }
        } catch(err){
            console.log(err);
        }
    }
}

// getTotalSavings();
onStartUp();
updateValues();