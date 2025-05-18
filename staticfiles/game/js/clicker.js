// clicker.js
function initIndexJS() {

    // Get variables from the data attributes
    var csrfToken = clickerContainer.getAttribute('data-csrf-token');
    let initialBalance = parseInt(clickerContainer.getAttribute('data-initial-balance'), 10);
    const userId = clickerContainer.getAttribute('data-user-id');


    function updateBalanceInDB(userId, initialBalance) {
        const newBalance = initialBalance + clickCount;

        fetch('update_balance/'), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'X-CSRFToken': csrfToken
            },
            body: `user_id=${userId}&new_balance=${newBalance}`
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                console.log('Баланс успешно обновлён.');
                initialBalance = newBalance;
            } else {
                console.error('Ошибка обновления баланса:', data.message);
            }
        })
        .catch(error => console.error('Ошибка:', error));
    }

    // Set up the click event listener here
    document.getElementById('click-button').addEventListener('click', countClicks);
}
