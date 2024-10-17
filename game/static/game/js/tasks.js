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
    function toggleTasks(questsToShow, questsToHide) {
        questsToHide.classList.add('hidden');
        questsToShow.classList.remove('hidden');
    }
    function toggleActive(elementToActivate, elementToDeactivate) {
        elementToDeactivate.classList.remove('active-border');
        elementToActivate.classList.add('active-border');
    }
    // Получаем ссылки на элементы меню и блоки с квестами
    const allTasks = document.getElementById('all-tasks');
    const completedTasks = document.getElementById('completed-tasks');
    const inCompletedTasksDiv = document.querySelector('.incomplete-tasks-div');
    const completedTasksDiv = document.querySelector('.complete-tasks-div');

    // Проверяем, что элементы существуют для переключения квестов
    if (allTasks && completedTasks && inCompletedTasksDiv && completedTasksDiv) {
        // Добавляем обработчики кликов для переключения классов и блоков
        allTasks.addEventListener('click', function() {
            toggleActive(allTasks, completedTasks);
            toggleTasks(inCompletedTasksDiv, completedTasksDiv);
        });

        completedTasks.addEventListener('click', function() {
            toggleActive(completedTasks, allTasks);
            toggleTasks(completedTasksDiv, inCompletedTasksDiv);
        });
    } else {
        console.log(allTasks);
        console.log(completedTasks);

        console.log(inCompletedTasksDiv);

        console.log(completedTasksDiv);

        console.error('Элементы меню квестов не найдены, скрипт не может быть выполнен.');
    }
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
    // Переменные для формы ближайшей игры
    var formNear = document.getElementById('create-task-form-near');
    console.log(formNear);
    var submitButtonNear = document.getElementById('create-task-button-near');
    var uploadImageButtonNear = document.getElementById('upload-image-button-near');
    var fileInputNear = formNear.querySelector('.task-img-input');
    var imagePreviewContainerNear = document.getElementById('image-preview-container-near');
    var taskDescInputNear = formNear.querySelector('.task-desc-input');

    // Переменные для формы дальней игры
    var formFar = document.getElementById('create-task-form-far');
    var submitButtonFar = document.getElementById('create-task-button-far');
    var uploadImageButtonFar = document.getElementById('upload-image-button-far');
    var fileInputFar = formFar.querySelector('.task-img-input');
    var imagePreviewContainerFar = document.getElementById('image-preview-container-far');
    var taskDescInputFar = formFar.querySelector('.task-desc-input');

    var goBackButton = document.getElementById('goback-button');
    var taskCreateMenu = document.getElementById('task-create-menu');
    var tasksMenuListDiv = document.querySelector('.tasks-menu-list-div');

    var topFieldNearImg = document.getElementById('favourites-img-near');
    var topFieldNear = document.getElementById('top-field-near');

    var topFieldFarImg = document.getElementById('favourites-img-far');
    var topFieldFar = document.getElementById('top-field-far');

    // Обработчики для переключения изображения favourites для near
    topFieldNearImg.addEventListener('click', function() {
        var currentSrc = topFieldNearImg.src;

        // Меняем изображение и значение поля top
        if (currentSrc.includes('favourites_ns.svg')) {
            topFieldNearImg.src = currentSrc.replace('favourites_ns.svg', 'favourites.svg');
            topFieldNear.value = 'True';  // Устанавливаем значение True для поля top
        } else {
            topFieldNearImg.src = currentSrc.replace('favourites.svg', 'favourites_ns.svg');
            topFieldNear.value = 'False'; // Возвращаем значение False для поля top
        }
    });

    // Обработчики для переключения изображения favourites для far
    topFieldFarImg.addEventListener('click', function() {
        var currentSrc = topFieldFarImg.src;

        // Меняем изображение и значение поля top
        if (currentSrc.includes('favourites_ns.svg')) {
            topFieldFarImg.src = currentSrc.replace('favourites_ns.svg', 'favourites.svg');
            topFieldFar.value = 'True';  // Устанавливаем значение True для поля top
        } else {
            topFieldFarImg.src = currentSrc.replace('favourites.svg', 'favourites_ns.svg');
            topFieldFar.value = 'False'; // Возвращаем значение False для поля top
        }
    });

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

    // Массивы для хранения выбранных файлов
    var selectedFilesNear = [];
    var selectedFilesFar = [];

    // Обработка выбора файлов для ближайшей игры
    fileInputNear.addEventListener('change', function(event) {
        handleFileSelect(event, selectedFilesNear, imagePreviewContainerNear, taskDescInputNear, fileInputNear);
    });

    // Обработка выбора файлов для дальней игры
    fileInputFar.addEventListener('change', function(event) {
        handleFileSelect(event, selectedFilesFar, imagePreviewContainerFar, taskDescInputFar, fileInputFar);
    });

    // Функция для обработки выбора файлов
    function handleFileSelect(event, selectedFiles, imagePreviewContainer, taskDescInput, fileInput) {
        var newFiles = Array.from(event.target.files);

        // Добавляем новые файлы в массив существующих, ограничивая количество до 3
        selectedFiles.splice(0, selectedFiles.length, ...[...selectedFiles, ...newFiles].slice(0, 3));

        // Обновляем файлы в input
        const dataTransfer = new DataTransfer();
        selectedFiles.forEach(function(file) {
            dataTransfer.items.add(file);
        });
        fileInput.files = dataTransfer.files;

        // Обновляем миниатюры
        renderImagePreviews(selectedFiles, imagePreviewContainer, taskDescInput, fileInput);
    }

    // Функция для рендеринга миниатюр
    function renderImagePreviews(files, container, taskDescInput, fileInput) {
        container.innerHTML = '';

        files.forEach(function(file, index) {
            var reader = new FileReader();

            reader.onload = function(e) {
                var img = document.createElement('img');
                img.src = e.target.result;
                img.classList.add('thumbnail');
                img.dataset.index = index;

                // Добавляем возможность удаления изображения при клике
                img.addEventListener('click', function() {
                    // Удаляем файл из массива
                    files.splice(index, 1);

                    // Обновляем файлы в input
                    const dataTransfer = new DataTransfer();
                    files.forEach(function(file) {
                        dataTransfer.items.add(file);
                    });
                    fileInput.files = dataTransfer.files;

                    // Обновляем миниатюры
                    renderImagePreviews(files, container, taskDescInput, fileInput);
                });

                container.appendChild(img);
            };

            reader.readAsDataURL(file);
        });

        // Если изображений нет, возвращаем исходный max-height
        if (files.length === 0) {
            taskDescInput.style.maxHeight = '';
        }
    }

function autoExpandField(field, initialHeight) {
    // Устанавливаем минимальную высоту для поля
    if (!field.style.height || field.scrollHeight <= initialHeight) {
        field.style.height = initialHeight + 'px';
    }

    // Если содержимое превышает начальное значение, увеличиваем высоту
    if (field.scrollHeight > initialHeight) {
        field.style.height = 'auto'; // Сбрасываем высоту для корректного измерения
        field.style.height = (field.scrollHeight) + 'px';
    }
}
    // Изначальная высота (в пикселях)
    var initialHeight = 100; // Например, 100 пикселей

    // Для поля описания ближайшей игры
    taskDescInputNear.addEventListener('input', function() {
        autoExpandField(this, initialHeight);
    });

    // Для поля описания дальней игры
    taskDescInputFar.addEventListener('input', function() {
        autoExpandField(this, initialHeight);
    });

    // Обработка отправки формы для ближайшей игры
    submitButtonNear.addEventListener('click', function(e) {
        e.preventDefault();

        var formData = new FormData(formNear);

        // Добавляем выбранные файлы в formData
        selectedFilesNear.forEach(function(file) {
            formData.append('images', file);
        });

        fetch('tasks/create/task', {
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
                imagePreviewContainerNear.innerHTML = '';
                selectedFilesNear = [];
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
        e.preventDefault();

        var formData = new FormData(formFar);

        // Добавляем выбранные файлы в formData
        selectedFilesFar.forEach(function(file) {
            formData.append('images', file);
        });

        fetch('tasks/create/task', {
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
                imagePreviewContainerFar.innerHTML = '';
                selectedFilesFar = [];
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
        taskCreateMenu.innerHTML = '';

        tasksMenuListDiv.classList.remove('hidden');
    });
}
