// progress.js
function initProgressJS() {
    const progressContent = document.getElementById('progress-content');
    const nearGamesButton = document.getElementById('near-games-button');
    const futureGamesButton = document.getElementById('future-games-button');
    const topGamesButton = document.getElementById('top-games-button');
    console.log(progressContent , nearGamesButton , futureGamesButton , topGamesButton);

    function setActiveButton(activeButton) {
        // Удаляем класс 'active-border' у всех кнопок
        [nearGamesButton, futureGamesButton, topGamesButton].forEach(button => {
            button.classList.remove('active-border');
        });
        // Добавляем класс 'active-border' к активной кнопке
        activeButton.classList.add('active-border');
    }

    function loadProgressContent(url) {
        fetch(url)
            .then(response => response.text())
            .then(html => {
                progressContent.innerHTML = html;

                // Если загружены категории, инициализируем кнопки категорий
                if (url.includes('near_games') || url.includes('future_games')) {
                    initCategoryButtons();
                }
            })
            .catch(error => {
                console.error("Ошибка при загрузке контента: ", error);
            });
    }

    nearGamesButton.addEventListener('click', function() {
        setActiveButton(nearGamesButton);
        loadProgressContent('progress/near_games/');
    });

    futureGamesButton.addEventListener('click', function() {
        setActiveButton(futureGamesButton);
        loadProgressContent('progress/future_games/');
    });

    topGamesButton.addEventListener('click', function() {
        setActiveButton(topGamesButton);
        loadProgressContent('progress/top_games/');
    });

    // Загружаем контент по умолчанию
    loadProgressContent('progress/near_games/');

    // Функция для инициализации кнопок категорий
    function initCategoryButtons() {
        const buttons = document.querySelectorAll('.category-button');

        buttons.forEach(button => {
            button.addEventListener('click', function() {
                const categoryId = this.id;
                const activeButtonId = document.querySelector('.progress-button.active-border').id;

                let farValue = 'false';
                if (activeButtonId === 'future-games-button') {
                    farValue = 'true';
                }

                // Отправляем запрос на сервер для получения задач в выбранной категории
                fetch(`progress/filter/?category=${categoryId}&far=${farValue}`)
                    .then(response => response.text())
                    .then(html => {
                        progressContent.innerHTML = html;
                        initBackButton(); // Инициализируем кнопку "Назад"
                    })
                    .catch(error => {
                        console.error("Ошибка при получении задач: ", error);
                    });
            });
        });
    }

    // Функция для инициализации кнопки "Назад"
    function initBackButton() {
        const backButton = document.getElementById('back-to-categories-button');
        if (backButton) {
            backButton.addEventListener('click', function() {
                // Определяем, какой контент нужно загрузить
                const activeButtonId = document.querySelector('.progress-button.active-border').id;
                if (activeButtonId === 'near-games-button') {
                    loadProgressContent('progress/near_games/');
                } else if (activeButtonId === 'future-games-button') {
                    loadProgressContent('progress/future_games/');
                }
            });
        }
    }
}

