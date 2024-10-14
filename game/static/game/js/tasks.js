function initTasksJS() {
    const categoriesDiv = document.getElementById('categories-menu-div');
    const newBlock = document.getElementById('task-menu-div');
    const buttons = document.querySelectorAll('.category-button');

    if (categoriesDiv && newBlock && buttons.length > 0) {
        console.log("Number of buttons found: ", buttons.length);

        function toggleVisibility(blockToShow, blockToHide) {
            blockToHide.classList.add('hidden');
            blockToShow.classList.remove('hidden');
        }

        buttons.forEach(button => {
            button.addEventListener('click', function() {
                const categoryId = this.id;
                console.log("Button with Category: " + categoryId + " was clicked.");

                // Отправляем AJAX-запрос на сервер
                fetch(`tasks/filter/?category=${categoryId}`)
                    .then(response => response.text())
                    .then(html => {
                        newBlock.querySelector('#task-list').innerHTML = html;
                        toggleVisibility(newBlock, categoriesDiv);
                        initTasksCreateJS(); // Вызов после обновления DOM

                    })
                    .catch(error => {
                        console.error("Ошибка при получении задач: ", error);
                    });
            });
        });
    } else {
        console.error('Элементы не найдены, скрипт initTasksJS не может быть выполнен.');
    }

}
function initTasksCreateJS() {
    const taskCreatePanel = document.getElementById('task-create-panel');
    const taskCreateMenu = document.getElementById('task-create-menu'); // Находим меню создания задачи
    const tasksMenuListDiv = document.querySelector('.tasks-menu-list-div'); // Находим элемент с классом tasks-menu-list-div

    if (taskCreatePanel) {
        taskCreatePanel.addEventListener('click', function(e) {
            e.preventDefault(); // Предотвращаем стандартное поведение

            // Извлекаем task_category из класса элемента
            let classList = taskCreatePanel.classList;
            let taskCategory = taskCreatePanel.classList[1];

            // Убираем класс hidden, чтобы сделать меню видимым
            if (taskCreateMenu) {
                taskCreateMenu.classList.remove('hidden');
            }

            // Добавляем класс hidden для tasks-menu-list-div
            if (tasksMenuListDiv) {
                tasksMenuListDiv.classList.add('hidden');
            }

            // Отправляем task_category в запросе на сервер
            fetch('tasks/create/?task_category=' + encodeURIComponent(taskCategory))
                .then(response => response.text())
                .then(html => {
                    document.getElementById('task-create-menu').innerHTML = html;
                    initTaskFormJS(); // Инициализируем форму после загрузки
                })
                .catch(error => {
                    console.error("Ошибка при загрузке формы: ", error);
                });
        });
    } else {
        console.log("Элемент для создания задачи не найден");
    }
}


function initTaskFormJS() {
    // Переменные для первой формы (near)
    var formNear = document.getElementById('create-task-form-near');
    var submitButtonNear = document.getElementById('create-task-button-near');
    var uploadImageButtonNear = document.getElementById('upload-image-button-near');
    var fileInputNear = formNear.querySelector('.task-img-input'); // Используем querySelector

    // Переменные для второй формы (far)
    var formFar = document.getElementById('create-task-form-far');
    var submitButtonFar = document.getElementById('create-task-button-far');
    var uploadImageButtonFar = document.getElementById('upload-image-button-far');
    var fileInputFar = formFar.querySelector('.task-img-input'); // Используем querySelector

    var goBackButton = document.getElementById('goback-button');
    var taskCreateMenu = document.getElementById('task-create-menu');
    var tasksMenuListDiv = document.querySelector('.tasks-menu-list-div'); // Находим элемент с классом tasks-menu-list-div

    if (!formNear || !submitButtonNear || !uploadImageButtonNear || !fileInputNear ||
        !formFar || !submitButtonFar || !uploadImageButtonFar || !fileInputFar ||
        !goBackButton || !tasksMenuListDiv) {
        console.log(formFar);
        console.log(submitButtonFar);

        console.log(uploadImageButtonFar);

        console.log(fileInputFar);

        console.error('Необходимые элементы формы не найдены.');
        return;
    }

    // Обработка клика на кнопку "Загрузить изображение" для ближайшей игры
    uploadImageButtonNear.addEventListener('click', function() {
        fileInputNear.click(); // Триггерим клик на скрытом input type="file"
    });

    // Обработка клика на кнопку "Загрузить изображение" для дальней игры
    uploadImageButtonFar.addEventListener('click', function() {
        fileInputFar.click(); // Триггерим клик на скрытом input type="file"
    });





    // Обработка отправки формы для ближайшей игры
    submitButtonNear.addEventListener('click', function(e) {
        e.preventDefault();  // Предотвращаем стандартное поведение кнопки

        var formData = new FormData(formNear);

        fetch('tasks/create/near', {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Сетевой ответ не был ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                formNear.reset();
                alert('Ближайшая задача успешно создана!');
            } else {
                console.error('Ошибка: ', data.errors);
                alert('Ошибка при создании ближайшей задачи');
            }
        })
        .catch(error => console.error('Ошибка AJAX запроса: ', error));
    });

    // Обработка отправки формы для дальней игры
    submitButtonFar.addEventListener('click', function(e) {
        e.preventDefault();  // Предотвращаем стандартное поведение кнопки

        var formData = new FormData(formFar);

        fetch('tasks/create/far', {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Сетевой ответ не был ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                formFar.reset();
                alert('Дальняя задача успешно создана!');
            } else {
                console.error('Ошибка: ', data.errors);
                alert('Ошибка при создании дальней задачи');
            }
        })
        .catch(error => console.error('Ошибка AJAX запроса: ', error));
    });

    // Обработка нажатия на кнопку "Назад"
    goBackButton.addEventListener('click', function() {
        taskCreateMenu.innerHTML = ''; // Очищаем содержимое контейнера

        // Убираем класс hidden у tasks-menu-list-div, чтобы показать его
        tasksMenuListDiv.classList.remove('hidden');
    });
}

