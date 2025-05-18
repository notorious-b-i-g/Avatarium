function initProgressJS() {
    const nearGamesButton = document.getElementById('near-games-button');
    const futureGamesButton = document.getElementById('future-games-button');
    const topGamesButton = document.getElementById('top-games-button');

    const nearGamesSection = document.getElementById('near-games-section');
    const futureGamesSection = document.getElementById('future-games-section');
    const topGamesSection = document.getElementById('top-games-section');

    const progressContent = document.getElementById('progress-content');
    const taskListSection = document.getElementById('task-list-section');
    const taskListContent = document.getElementById('task-list-content');

    const tasksPanel = document.getElementById('progress-menu');

    function setActiveButton(activeButton) {
        [nearGamesButton, futureGamesButton, topGamesButton].forEach(button => {
            button.classList.remove('active-border');
        });
        activeButton.classList.add('active-border');
    }

    // Функция для отображения выбранной секции и скрытия остальных
    function showSection(sectionToShow) {
        [nearGamesSection, futureGamesSection, topGamesSection].forEach(section => {
            section.classList.add('hidden');
        });
        sectionToShow.classList.remove('hidden');
        currentSection = sectionToShow;
    }

    // Обработчики кликов для меню
    nearGamesButton.addEventListener('click', function() {
        setActiveButton(nearGamesButton);
        showSection(nearGamesSection);
    });

    futureGamesButton.addEventListener('click', function() {
        setActiveButton(futureGamesButton);
        showSection(futureGamesSection);
    });

    topGamesButton.addEventListener('click', function() {
        setActiveButton(topGamesButton);
        showSection(topGamesSection);
    });

    // Функция для инициализации кнопок категорий внутри секций
    function initCategoryButtons(section) {
        const categoryButtons = section.querySelectorAll('.category-container-progress');
        categoryButtons.forEach(button => {
            button.addEventListener('click', function() {
                const categoryId = this.getAttribute('data-category-id');
                const categoryName = this.getAttribute('data-category-name');
                const far = (section.id === 'near-games-section') ? 'false' : 'true';
                tasksPanel.classList.add('hidden');

                fetch(`/game/progress/tasks/?category_id=${categoryId}&far=${far}`)
                    .then(response => response.text())
                    .then(html => {
                        taskListContent.innerHTML = html;
                        progressContent.classList.add('hidden');
                        taskListSection.classList.remove('hidden');
                        initDetailProgress();
                    })
                    .catch(error => {
                        console.error("Ошибка при получении задач: ", error);
                    });
            });
        });
    }

    initCategoryButtons(nearGamesSection);
    initCategoryButtons(futureGamesSection);

    const progressContentDiv = document.getElementById('progress-content-div');
    const taskInfo = document.getElementById('task-info');
    const taskInfoDiv = document.getElementById('task-info-div');
    const allTaskItemsProgressTop = document.querySelectorAll('.task-item');

    if (allTaskItemsProgressTop.length > 0) {
        allTaskItemsProgressTop.forEach(task => {
            // Обработчик клика по задаче
            task.addEventListener('click', function(event) {
                // Проверяем, что клик не по изображению избранного
                if (!event.target.classList.contains('task-top-img-progress')) {
                    progressContentDiv.classList.add('hidden');
                    // Извлекаем ID задачи из атрибута data-task-id
                    let taskId = task.getAttribute('data-task-id');
                    if (taskId) {
                        taskInfo.classList.remove('hidden');
                        // Отправляем запрос на сервер для получения информации о задаче
                        fetch('tasks/see_task/?task_id=' + encodeURIComponent(taskId))
                            .then(response => response.text())
                            .then(html => {
                                // Обновляем содержимое task-info-div
                                taskInfoDiv.innerHTML = html;

                                const taskTitle = task.querySelector('.task-title-top');
                                const taskTopFlagInList = task.querySelector('.task-top-img-progress');

                                initSeeTaskJS(taskTitle, taskTopFlagInList);

                                // Инициализируем дополнительные обработчики, если необходимо
                            })
                            .catch(error => {
                                console.error("Ошибка при загрузке информации о задаче: ", error);
                            });
                    } else {
                        console.error("Не удалось извлечь ID задачи.");
                    }
                }
            });
        });
    }
    const goBackButton = document.getElementById('goback-button');
    goBackButton.addEventListener('click', function() {
        // Очищаем содержимое task-info-div
        taskInfoDiv.innerHTML = '';

        taskInfo.classList.add('hidden');
        progressContentDiv.classList.remove('hidden');

        // Добавляем класс hidden к task-create-menu

    });
}


function initDetailProgress() {
    const contentMainDiv = document.getElementById('content');
    const csrfToken = contentMainDiv.getAttribute('data-csrf-token');

    const taskListSection = document.getElementById('task-list-section');
    const progressContent = document.getElementById('progress-content');
    const progressContentDiv = document.getElementById('progress-content-div');

    const tasksPanel = document.getElementById('progress-menu');
    const backToCategoriesButton = document.getElementById('back-to-categories-button');

    const taskInfo = document.getElementById('task-info');
    const taskInfoDiv = document.getElementById('task-info-div');

    const allTaskItemsProgress = document.querySelectorAll('.task-content-progress');
    if (allTaskItemsProgress.length > 0) {
        allTaskItemsProgress.forEach(task => {
            // Обработчик клика по задаче
            task.addEventListener('click', function(event) {
                // Проверяем, что клик не по изображению избранного
                if (!event.target.classList.contains('task-top-img-progress')) {
                    progressContentDiv.classList.add('hidden');
                    ShowAndHideLoadingScreen('info');
                    // Извлекаем ID задачи из атрибута data-task-id
                    let taskId = task.getAttribute('data-task-id');
                    if (taskId) {
                        taskInfo.classList.remove('hidden');
                        // Отправляем запрос на сервер для получения информации о задаче
                        fetch('tasks/see_task/?task_id=' + encodeURIComponent(taskId))
                            .then(response => response.text())
                            .then(html => {
                                // Обновляем содержимое task-info-div
                                taskInfoDiv.innerHTML = html;

                                const taskTitle = task.querySelector('.task-title-progress');
                                const taskTopFlagInList = task.querySelector('.task-top-img-progress');

                                initSeeTaskJS(taskTitle, taskTopFlagInList);

                                // Инициализируем дополнительные обработчики, если необходимо
                            })
                            .catch(error => {
                                console.error("Ошибка при загрузке информации о задаче: ", error);
                            });
                    } else {
                        console.error("Не удалось извлечь ID задачи.");
                    }
                }
            });
            if (task.getAttribute('data-task-complete') === "False"){
            // Обработчик клика по изображению избранного внутри задачи
            const img = task.querySelector('.task-top-img-progress');
            if (img) {
                img.addEventListener('click', function(event) {
                    // Останавливаем всплытие события, чтобы клик по изображению не triggeрил клик по задаче
                    event.stopPropagation();

                    const taskId = task.getAttribute('data-task-id');
                    const currentSrc = img.src;

                    let priority;
                    if (currentSrc.includes('favourites.svg')) {
                        img.src = currentSrc.replace('favourites.svg', 'favourites_ns.svg');
                        priority = false;
                    } else {
                        img.src = currentSrc.replace('favourites_ns.svg', 'favourites.svg');
                        priority = true;
                    }

                    fetch('update_task_priority', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                            'X-CSRFToken': csrfToken
                        },
                        body: `task_id=${encodeURIComponent(taskId)}&priority=${encodeURIComponent(priority)}`
                    })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Ошибка выполнения запроса');
                        }
                        return response.json();
                    })
                    .then(data => {
                        console.log('Запрос успешно выполнен', data);
                    })
                    .catch(error => {
                        console.error('Ошибка сети:', error);
                    });
                });
            }}
        });
    } else {
        console.log("Элементы задач не найдены.");
    }

    backToCategoriesButton.addEventListener('click', function() {
        taskListSection.classList.add('hidden');
        progressContent.classList.remove('hidden');
        tasksPanel.classList.remove('hidden');
    });
}

