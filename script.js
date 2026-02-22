document.getElementById('submitBtn').addEventListener('click', function() {
    const userInput = document.getElementById('userInput').value;
    
    if (!userInput.trim()) {
        alert('Please enter a prompt');
        return;
    }
    
    console.log('User input:', userInput);
    // We'll add API calls here soon
});
