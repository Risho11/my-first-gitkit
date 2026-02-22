const API_KEY = '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';

document.getElementById('submitBtn').addEventListener('click', function() {
    const userInput = document.getElementById('userInput').value;
    
    if (!userInput.trim()) {
        alert('Please enter a prompt');
        return;
    }
    
    console.log('User input:', userInput);
    // We'll add API calls here soon
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '<p>Loading...</p>';
    
    try {
        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': API_KEY,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: 'claude-3-5-sonnet-20241022',
                max_tokens: 1024,
                messages: [
                    {
                        role: 'user',
                        content: userInput
                    }
                ]
            })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            resultsDiv.innerHTML = `<p style="color: red;">Error: ${data.error.message}</p>`;
            return;
        }
        
        // Display the response
        const claudeResponse = data.content[0].text;
        resultsDiv.innerHTML = `
            <div class="ai-response">
                <h3>Claude Response</h3>
                <p>${claudeResponse}</p>
            </div>
        `;
        
    } catch (error) {
        resultsDiv.innerHTML = `<p style="color: red;">Error: ${error.message}</p>`;
    }
});

