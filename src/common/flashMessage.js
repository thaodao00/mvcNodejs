function getFlashMessage() {
    fetch('/getFlashMessage')
        .then(response => response.json())
        .then(data => {
            const flashMessageDiv = document.getElementById('flash-message');
            flashMessageDiv.innerHTML = `
                <p>Success: ${data.successMessage}</p>
                <p>Error: ${data.errorMessage}</p>
            `;
        });
}

export default getFlashMessage;