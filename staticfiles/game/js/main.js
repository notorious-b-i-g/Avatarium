function loadContent(tab) {
    var page = '';
    console.log(tab);

    if (tab == '0') {
        page = 'index';
    } else if (tab == '1') {
        page = 'quest';
    } else if (tab == '2') {
        page = 'tasks';
    } else if (tab == '3') {
        page = 'progress';
    } else if (tab == '4') {
        page = 'library';
    } else if (tab == '5'){
        page = "profile";
    } else if (tab == '6'){
        page = 'challenge'
    } else if (tab == '7'){
        page = 'counter'
    }
    console.log(page);

    var loadingKey = 'loadingScreenShown_' + page;
    var loadingTimeout;
    var loadingScreenHidden = false;

    // Проверяем, был ли экран загрузки уже показан для этой вкладки
    if (!sessionStorage.getItem(loadingKey)) {
        // Показываем экран загрузки
        var loadingScreen = document.getElementById('loading-screen');
        loadingScreen.style.display = 'flex';
        loadingScreen.style.opacity = '1'; // Для анимации, если необходимо

        // Запускаем таймер на 4 секунды для скрытия экрана загрузки
        loadingTimeout = setTimeout(function() {
            hideLoadingScreen(true); // Передаем true, чтобы указать, что это вызов по таймеру
        }, 4000);
    }

    // Функция для скрытия экрана загрузки
    function hideLoadingScreen(timeoutReached) {
        if (!loadingScreenHidden && !sessionStorage.getItem(loadingKey)) {
            loadingScreenHidden = true; // Устанавливаем флаг, что экран уже скрыт
            var loadingScreen = document.getElementById('loading-screen');
            // Скрываем экран загрузки после завершения анимации
            setTimeout(function() {
                loadingScreen.style.display = 'none';
            }, 600); // Время соответствует transition в CSS

            // Помечаем, что экран загрузки уже был показан для этой вкладки
            sessionStorage.setItem(loadingKey, 'true');

            // Очищаем таймер, если контент загрузился до истечения 4 секунд
            if (!timeoutReached) {
                clearTimeout(loadingTimeout);
            }
        }
    }

    var xhr = new XMLHttpRequest();
    xhr.open('GET', page, true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            // Добавляем класс pressed текущей кнопке
            console.log('custom-button' + tab);
            var currentButton = document.getElementById('custom-button' + tab);
            console.log(currentButton);
            currentButton.classList.add('pressed');

            var contentElement = document.getElementById('content');
            contentElement.innerHTML = xhr.responseText;
            history.pushState(null, '' + tab);

            // Удаляем класс pressed у всех кнопок
            var buttons = document.getElementsByClassName('single-button');
            for (var i = 0; i < buttons.length; i++) {
                buttons[i].classList.remove('pressed');
            }

            // Инициализируем скрипты для загруженного контента
            if (page === 'index') {
                initAvatarJS();
            } else if (page === 'quest') {
                initQuestJS();
            } else if (page === 'tasks') {
                initTasksJS();
            } else if (page === 'progress') {
                initProgressJS();
            } else if (page === 'library') {
                initLibraryJS();
            } else if (page === 'profile') {
                initProfileJS();
            } else if (page === 'challenge') {
                initChallengeJS();
            } else if (page === 'counter') {
                console.log(22814);

                initCounterJS();
            }


            // Проверяем, загружены ли все CSS файлы
            var cssPromises = [];
            var stylesheets = contentElement.getElementsByTagName('link');
            for (var i = 0; i < stylesheets.length; i++) {
                if (stylesheets[i].rel === 'stylesheet') {
                    cssPromises.push(new Promise(function(resolve, reject) {
                        stylesheets[i].onload = resolve;
                        stylesheets[i].onerror = reject;
                    }));
                }
            }

            // Ждем загрузки всех стилей
            if (cssPromises.length > 0) {
                Promise.all(cssPromises).then(function() {
                    hideLoadingScreen(false);
                }).catch(function(error) {
                    console.error('Ошибка загрузки стилей:', error);
                    hideLoadingScreen(false); // Даже если произошла ошибка, скрываем экран загрузки
                });
            } else {
                // Если стилей нет, скрываем экран загрузки сразу
                hideLoadingScreen(false);
            }
        }
    };
    xhr.send();
}






// Функция для обновления баланса, принимающая сумму для добавления
function updateBalance(amountToAdd, csrfToken) {
    fetch('update_balance/', { // Убедитесь, что URL корректен
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'X-CSRFToken': csrfToken
        },
        body: `balance_change=${encodeURIComponent(amountToAdd)}`
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            console.log('Баланс успешно обновлён.');
        } else {
            console.error('Ошибка обновления баланса:', data.message);
        }
    })
    .catch(error => console.error('Ошибка:', error));

}
function iphoneFix(targetInputs) {
    // Обработчик клика по всему документу
    $('body').on('click', function (event) {
        // Проверяем, был ли клик внутри элемента с id "task-desc-text"
        const isClickInsideTaskDesc = $(event.target).closest('#task-desc-text').length > 0;

        // Проверяем, был ли клик внутри любого из целевых <input> элементов
        const isClickOnAnyTargetInput = targetInputs.some(input => $(event.target).is(input));

        if (!isClickInsideTaskDesc && !isClickOnAnyTargetInput) {
            // Если клик был вне taskDescInput и вне всех целевых <input>, снимаем фокус
            document.activeElement.blur();
            console.log("blur");
        }
    });

    // Добавляем обработчик клика для каждого <input> в массиве, чтобы предотвратить всплытие события
    targetInputs.forEach(input => {
        $(input).on('click', function (event) {
            event.stopPropagation();
        });
    });
}



// Функция логирования с await для последовательности
async function logEvent(message) {
    const contentMainDiv = document.getElementById('content');
    const csrfToken = contentMainDiv.getAttribute('data-csrf-token');
    try {
        await fetch('log', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'X-CSRFToken': csrfToken
            },
            body: JSON.stringify({ log: message })
        });
    } catch (error) {
        console.error('Ошибка отправки лога:', error);
    }
}

// Основная функция загрузки
window.onload = function() {
    sessionStorage.clear()
    loadContent(0);
};

// Отключаем вертикальные свайпы при открытии в Telegram Web App
if (window.Telegram && window.Telegram.WebApp) {
    window.Telegram.WebApp.disableVerticalSwipes();
    window.Telegram.WebApp.expand(); // Разворачиваем приложение на весь экран

}
function ShowAndHideLoadingScreen(loadingKey) {

    if (!sessionStorage.getItem(loadingKey)) {
        const loadingScreen = document.getElementById('loading-screen');
        loadingScreen.style.display = 'flex';
        // Скрываем экран загрузки после завершения анимации
        setTimeout(function() {
            loadingScreen.style.display = 'none';
        }, 600);
    }
    sessionStorage.setItem(loadingKey, 'true');
}

function toggleVisibility(toShow, ...elements) {
    elements.forEach(element => {
        if (!element) return;
        if (element === toShow) {
            element.classList.remove('hidden');
        } else {
            element.classList.add('hidden');
        }
    });
}
if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', () => {
        document.body.style.height = `${window.visualViewport.height}px`;
    });
}
