// main.js
function loadContent(tab) {
    var page = '';
    if(tab == '0') {
        page = 'index';  // URL, настроенный в Django urls.py
    } else if(tab == '1') {
        page = 'quest';  // URL, настроенный в Django urls.py
    } else if(tab == '2') {
        page = 'tasks';  // URL, настроенный в Django urls.py
    }
    var xhr = new XMLHttpRequest();
    xhr.open('GET', page, true);
    xhr.onreadystatechange = function () {
        if(xhr.readyState == 4 && xhr.status == 200) {
            document.getElementById('content').innerHTML = xhr.responseText;
            // Обновляем URL без перезагрузки страницы
            history.pushState(null, '' + tab);

            // Инициализируем скрипты для загруженного контента
            if (page === 'quest') {
                initQuestJS();
            } else if(page === 'tasks') {
                initTasksJS();
            }
        }
    };
    xhr.send();
}

// clicker.js
function initBalanceJS() {
    const questInfo = document.getElementById('quest-info'); // Элемент с ID 'quest-info'

    if (!questInfo) {
        console.error('Элемент quest-info не найден.');
        return;
    }

    // Получаем переменные из data-атрибутов
    const csrfToken = questInfo.getAttribute('data-csrf-token');
    let initialBalance = parseInt(questInfo.getAttribute('data-initial-balance'), 10);
    const userId = questInfo.getAttribute('data-user-id');

    if (!csrfToken || !userId) {
        console.error('Не удалось получить CSRF-токен или ID пользователя.');
        return;
    }

    // Получаем элемент кнопки завершения квеста
    const completeButton = document.getElementById('complete-button-incomplete');

    if (!completeButton) {
        console.error('Кнопка завершения квеста не найдена.');
        return;
    }

    // Добавляем обработчик события 'click' к кнопке
    completeButton.addEventListener('click', function() {
        // Получаем значение 'price' из data-атрибута
        const price = parseInt(completeButton.getAttribute('data-price'), 10);

        if (isNaN(price)) {
            console.error('Не удалось получить значение цены квеста.');
            return;
        }

        // Вычисляем новый баланс
        const newBalance = initialBalance + price;

        // Вызываем функцию обновления баланса
        updateBalanceInDB(userId, newBalance);

        // Дополнительно можно обновить интерфейс пользователя
        // Например, обновить отображение баланса на странице
        initialBalance = newBalance; // Обновляем локальную переменную initialBalance
        // document.getElementById('balance-display').textContent = initialBalance;

        // Также можно отметить квест как выполненный или выполнить другие действия
    });

    // Функция для обновления баланса в базе данных
    function updateBalanceInDB(userId, newBalance) {
        fetch('update_balance/', { // Убедитесь, что URL корректен
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'X-CSRFToken': csrfToken
            },
            body: `user_id=${encodeURIComponent(userId)}&new_balance=${encodeURIComponent(newBalance)}`
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                console.log('Баланс успешно обновлён.');

                // Здесь можно выполнить дополнительные действия после успешного обновления баланса
            } else {
                console.error('Ошибка обновления баланса:', data.message);
            }
        })
        .catch(error => console.error('Ошибка:', error));
    }
}

// Загрузка контента при загрузке страницы
window.onload = function() {
    loadContent(1);
};
