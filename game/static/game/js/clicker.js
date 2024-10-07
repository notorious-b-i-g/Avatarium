let clickCount = 0;
let timer = null;

function countClicks(initialBalance, userId) {
    clickCount++;
    console.log('Количество кликов: ' + clickCount);

    // Сбрасываем предыдущий таймер, если он есть
    if (timer) {
        clearTimeout(timer);
    }

    // Запускаем новый таймер на 5 секунд
    timer = setTimeout(function() {
        console.log('Нет кликов в течение 5 секунд. Обновляем баланс в БД.');

        // Обновляем баланс в базе данных через AJAX
        updateBalanceInDB(initialBalance, userId);

        // Сбрасываем счётчик кликов после обновления
        clickCount = 0;
    }, 5000);  // 5000 миллисекунд = 5 секунд
}

function updateBalanceInDB(initialBalance, userId) {
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
