const getTotalSavings = async () => {
    const response = await fetch('localhost:4000/api/total-savings');
    if (response.ok){
        const jsonResponse = await response.json();
        console.log(jsonResponse);
        return jsonResponse;
    }
}

getTotalSavings();