// clicker.js
function initIndexJS() {
    let clickCount = 0;
    let timer = null;

    // Get variables from the data attributes
    var clickerContainer = document.getElementById('clicker-container');
    var updateBalanceUrl = clickerContainer.getAttribute('data-update-balance-url');
    var csrfToken = clickerContainer.getAttribute('data-csrf-token');
    let initialBalance = parseInt(clickerContainer.getAttribute('data-initial-balance'), 10);
    const userId = clickerContainer.getAttribute('data-user-id');

    function countClicks() {
        clickCount++;
        console.log('Количество кликов: ' + clickCount);

        // Reset the previous timer if it exists
        if (timer) {
            clearTimeout(timer);
        }

        // Start a new timer for 5 seconds
        timer = setTimeout(function() {
            console.log('Нет кликов в течение 5 секунд. Обновляем баланс в БД.');

            // Update balance in the database via AJAX
            updateBalanceInDB();

            // Reset click count after updating
            clickCount = 0;
        }, 5000);  // 5000 milliseconds = 5 seconds
    }

    function updateBalanceInDB(userId, initialBalance) {
        const newBalance = initialBalance + clickCount;

        fetch(updateBalanceUrl, {
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
