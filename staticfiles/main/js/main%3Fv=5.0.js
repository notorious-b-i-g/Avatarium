let blockNumber = 1;

if (window.Telegram && window.Telegram.WebApp) {

    window.Telegram.WebApp.expand();
    window.Telegram.WebApp.disableVerticalSwipes();
    window.Telegram.WebApp.onEvent('viewportChanged', function() {
        window.Telegram.WebApp.expand();
    });

    // Уведомляем Telegram, что приложение готово
    window.Telegram.WebApp.ready();

    // Переменная user объявляется заранее
    let user = null;

    // Получение данных пользователя
    try {
        if (window.Telegram.WebApp.initDataUnsafe && window.Telegram.WebApp.initDataUnsafe.user) {
            user = window.Telegram.WebApp.initDataUnsafe.user; // Присваиваем значение
        } else {
            alert('initDataUnsafe или user недоступен');
        }
    } catch (error) {
        console.error('Ошибка при доступе к initDataUnsafe:', error);
        alert('Ошибка при доступе к initDataUnsafe.');
    }

    if (user) {

        const userId = user.id;
        const username = user.username || '';
        // Обновляем параметры ссылки
        const linkElement = document.getElementById('custom-button3');
        if (linkElement) {
            const newUrl = `https://matricasutbi.online/game/?username=${encodeURIComponent(userId)}&usertelegramname=${encodeURIComponent(username)}`;

            linkElement.setAttribute('href', newUrl); // Устанавливаем новый href

            // Получаем и выводим ссылку для проверки
            const updatedUrl = linkElement.getAttribute('href');
        }

        fetch(`check_user_exist/?userId=${userId}&username=${encodeURIComponent(username)}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        })
        .then(async response => {
            const data = await response.json();
            if (data.success) {
                // Выполняем редирект на стороне клиента
                window.location.href = data.redirect_url;
            } else {
                // Обработка ошибки
                console.error(data.message);
                alert(data.message);
            }
        })
.catch(error => {
    console.error('Ошибка при выполнении запроса:', error.message);
});


    } else {
        alert('Информация о пользователе недоступна.');
    }
} else {
    alert('Пожалуйста, откройте это приложение через Telegram.');
}


// Функция для переключения блоков
function loadNextImage() {
    // Скрываем текущий блок
    document.querySelector('.block-content.active').classList.remove('active');

    // Увеличиваем номер блока
    blockNumber++;
    if (blockNumber > 3) blockNumber = 1;  // Если превышен номер блока, возвращаемся к 1

    // Отображаем следующий блок
    document.getElementById('block' + blockNumber).classList.add('active');
}

document.addEventListener("DOMContentLoaded", function() {
    setTimeout(function() {
        const loadingScreen = document.getElementById("loading-screen-start");
        if (loadingScreen) {
            loadingScreen.style.display = "none";
        }
    }, 1500); // Задержка в 1.5 секунды
});
