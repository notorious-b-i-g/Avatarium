function initTasksJS() {
    const categoriesDiv = document.getElementById('categories-menu-div');
    const newBlock = document.getElementById('task-menu-div');
    const buttons = document.querySelectorAll('.category-button');


    if (categoriesDiv && newBlock && buttons.length > 0) {

        function toggleVisibility(blockToShow, blockToHide) {
            blockToHide.classList.add('hidden');
            blockToShow.classList.remove('hidden');
        }

        buttons.forEach(button => {
            button.addEventListener('click', function() {
                const categoryId = this.id;

                // Отправляем AJAX-запрос на сервер
                fetch(`tasks/filter/?category=${categoryId}`)
                    .then(response => response.text())
                    .then(html => {
                        newBlock.querySelector('#task-list').innerHTML = html;
                        toggleVisibility(newBlock, categoriesDiv);
                        initTasksSeeAndCreateJS(); // Вызов после обновления DOM

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

function initTasksSeeAndCreateJS() {
    function toggleActive(toShow, ...elements) {
        elements.forEach(element => {
            if (!element) return;
            element.classList.remove('active-border');
            toShow.classList.add('active-border');

        });
    }
    // Получаем ссылки на элементы меню и блоки с квестами
    const nearTasks = document.getElementById('near-tasks');
    const farTasks = document.getElementById('far-tasks');
    const completedTasks = document.getElementById('completed-tasks');

    const nearTaskDiv = document.getElementById('near-tasks-div');
    const farTaskDiv = document.getElementById('far-tasks-div');
    const completedTasksDiv = document.getElementById('completed-tasks-div');
    console.log(nearTaskDiv, farTaskDiv, completedTasksDiv);
    // Проверяем, что все элементы существуют
    if (
        nearTasks && farTasks && completedTasks &&
        nearTaskDiv && farTaskDiv && completedTasksDiv
    ) {
        // Клик по "Ближайшие задачи"
        nearTasks.addEventListener('click', function() {
            toggleActive(nearTasks, farTasks, completedTasks);
            toggleVisibility(nearTaskDiv, farTaskDiv, completedTasksDiv);
        });

        // Клик по "Дальние задачи"
        farTasks.addEventListener('click', function() {
            toggleActive(farTasks, nearTasks, completedTasks);
            toggleVisibility(farTaskDiv, nearTaskDiv, completedTasksDiv);
        });

        // Клик по "Завершённые задачи"
        completedTasks.addEventListener('click', function() {
            toggleActive(completedTasks, nearTasks, farTasks);
            toggleVisibility(completedTasksDiv, nearTaskDiv, farTaskDiv);
        });
    } else {
        console.error('Элементы переключателя задач не найдены, скрипт не может быть выполнен.');
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
                ShowAndHideLoadingScreen('form');

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

    const taskInfoDiv = document.getElementById('task-info-div');
    const allTaskItems = document.querySelectorAll('.task-content');
    const goBackButton = document.getElementById('goback-button'); // Находим кнопку "Назад"
    const taskInfo = document.getElementById('task-info');

    if (allTaskItems.length > 0) {
        allTaskItems.forEach(task => {
            task.addEventListener('click', function() {
                // Извлекаем ID задачи из атрибута data-quest-id
                let taskId = task.getAttribute('data-quest-id');
                if (taskId) {
                    // Добавляем класс 'hidden' для task-menu (аналогично, как в quest.js)
                    const tasksMenuListDiv = document.querySelector('.tasks-menu-list-div');
                    if (tasksMenuListDiv) {
                        ShowAndHideLoadingScreen('info');
                        tasksMenuListDiv.classList.add('hidden');
                    }

                    if (taskInfo) {
                        taskInfo.classList.remove('hidden');
                    }

                    // Отправляем запрос с ID задачи на сервер
                    fetch('tasks/see_task/?task_id=' + encodeURIComponent(taskId))
                        .then(response => response.text())
                        .then(html => {
                            // Обновляем содержимое task-info-div
                            taskInfoDiv.innerHTML = html;
                            const taskTitle = task.querySelector('[class^="task-title"]');
                            const taskTopFlagInList = task.querySelector('.task-top-img');

                            initSeeTaskJS(taskTitle, taskTopFlagInList);

                            // Инициализируем необходимые обработчики после добавления нового контента, если это нужно
                        })
                        .catch(error => {
                            console.error("Ошибка при загрузке информации о задаче: ", error);
                        });
                } else {
                    console.error("Не удалось извлечь ID задачи.");
                }
            });
        });
    } else {
        console.log("Элементы задач не найдены.");
    }

    goBackButton.addEventListener('click', function() {
        // Очищаем содержимое task-info-div
        taskInfoDiv.innerHTML = '';

        if (taskCreateMenu) {
            taskInfo.classList.add('hidden');
        }
        if (tasksMenuListDiv) {
            tasksMenuListDiv.classList.remove('hidden');
        }

        // Добавляем класс hidden к task-create-menu

    });


}


function initTaskFormJS() {
    // Variables for the near game form
    const formNear = document.getElementById('create-task-form-near');
    const submitButtonNear = document.getElementById('create-task-button-near');
    const uploadImageButtonNear = document.getElementById('upload-image-button-near');
    const fileInputNear = formNear.querySelector('.task-img-input');
    const imagePreviewContainerNear = document.getElementById('image-preview-container-near');
    //const taskDescInputNear = formNear.querySelector('.task-desc-input');

    // Variables for the far game form
    const formFar = document.getElementById('create-task-form-far');
    const submitButtonFar = document.getElementById('create-task-button-far');
    const uploadImageButtonFar = document.getElementById('upload-image-button-far');
    const fileInputFar = formFar.querySelector('.task-img-input');
    const imagePreviewContainerFar = document.getElementById('image-preview-container-far');
    //const taskDescInputFar = formFar.querySelector('.task-desc-input');

    const containerNear = document.getElementById('form-container-near');
    const firstFormNear = containerNear.querySelector('.task-item-form'); // Получаем первую форму
    if (firstFormNear) {
        const textInputs = firstFormNear.querySelectorAll('input[type="text"], textarea'); // Поля первой формы
        textInputs.forEach((input) => {
            input.addEventListener('keydown', (event) => handleKeyDown(event, 'form-container-near'));
        });
    }

    const containerFar = document.getElementById('form-container-far');
    const firstFormFar = containerFar.querySelector('.task-item-form'); // Получаем первую форму
    if (firstFormFar) {
        const textInputs = firstFormFar.querySelectorAll('input[type="text"], textarea'); // Поля первой формы
        textInputs.forEach((input) => {
            input.addEventListener('keydown', (event) => handleKeyDown(event, 'form-container-far'));
        });
    }

    var inputFields = [firstFormNear, firstFormFar]
    var forms = [formNear, formFar];
    forms.forEach((form, index) => {
        if (form) {  // Check if form exists
            const button = document.querySelectorAll('.create-task-submit')[index]; // Find button by index

            const title = form.querySelector('.task-title-input');
            //const description = form.querySelector('.task-desc-input');
            inputFields.push(title);
            // Function to check form completion
            function checkFormCompletion() {
                if (title.value.trim()) {
                    button.classList.add('completed'); // Add class if fields are filled
                } else {
                    button.classList.remove('completed'); // Remove class if something is not filled
                }
            }

            // Add listeners for fields
            title.addEventListener('input', checkFormCompletion);
            //description.addEventListener('input', checkFormCompletion);
        }
    });
    iphoneFix(inputFields);
    const goBackButton = document.getElementById('goback-button');
    const taskCreateMenu = document.getElementById('task-create-menu');
    const tasksMenuListDiv = document.querySelector('.tasks-menu-list-div');

    const topFieldNearImg = document.getElementById('favourites-img-near');
    const topFieldNear = document.getElementById('top-field-near');

    const topFieldFarImg = document.getElementById('favourites-img-far');
    const topFieldFar = document.getElementById('top-field-far');

    // Handlers for toggling favourites image for near
    topFieldNearImg.addEventListener('click', function() {
        var currentSrc = topFieldNearImg.src;

        // Change image and value of top field
        if (currentSrc.includes('favourites_ns.svg')) {
            topFieldNearImg.src = currentSrc.replace('favourites_ns.svg', 'favourites.svg');
            topFieldNear.value = 'True';  // Set value True for top field
        } else {
            topFieldNearImg.src = currentSrc.replace('favourites.svg', 'favourites_ns.svg');
            topFieldNear.value = 'False'; // Set value False for top field
        }
    });

    // Handlers for toggling favourites image for far
    topFieldFarImg.addEventListener('click', function() {
        var currentSrc = topFieldFarImg.src;

        // Change image and value of top field
        if (currentSrc.includes('favourites_ns.svg')) {
            topFieldFarImg.src = currentSrc.replace('favourites_ns.svg', 'favourites.svg');
            topFieldFar.value = 'True';  // Set value True for top field
        } else {
            topFieldFarImg.src = currentSrc.replace('favourites.svg', 'favourites_ns.svg');
            topFieldFar.value = 'False'; // Set value False for top field
        }
    });

    goBackButton.addEventListener('click', function() {
        taskCreateMenu.innerHTML = '';
        tasksMenuListDiv.classList.remove('hidden');
    });
    // Handle click on "Upload Image" button for near game
    uploadImageButtonNear.addEventListener('click', function() {
        fileInputNear.click(); // Trigger click on hidden input type="file"
    });

    // Handle click on "Upload Image" button for far game
    uploadImageButtonFar.addEventListener('click', function() {
        fileInputFar.click(); // Trigger click on hidden input type="file"
    });
    // Arrays to store selected files
    var selectedFilesNear = [];
    var selectedFilesFar = [];

    // Handle file selection for near game
    fileInputNear.addEventListener('change', function(event) {
        handleFileSelect(event, selectedFilesNear, imagePreviewContainerNear, fileInputNear);
    });

    // Handle file selection for far game
    fileInputFar.addEventListener('change', function(event) {
        handleFileSelect(event, selectedFilesFar, imagePreviewContainerFar, fileInputFar);
    });

    // Function to handle file selection


    // Initial height (in pixels)
    var initialHeight = 100; // For example, 100 pixels

//    taskDescInputNear.addEventListener('input', function() {
//        autoExpandField(this, initialHeight);
//    });
//
//    taskDescInputFar.addEventListener('input', function() {
//        autoExpandField(this, initialHeight);
//    });

    // Use for near form
    submitButtonNear.addEventListener('click', function(e) {
        e.preventDefault();
        handleFormSubmit(formNear, selectedFilesNear, imagePreviewContainerNear, 'Ближайшая задача успешно создана!', 'tasks/create/task');
    });

    // Use for far form
    submitButtonFar.addEventListener('click', function(e) {
        e.preventDefault();
        handleFormSubmit(formFar, selectedFilesFar, imagePreviewContainerFar, 'Дальняя задача успешно создана!', 'tasks/create/task');
    });
}

function initSeeTaskJS(taskTitle, taskTopFlagInList) {

    const contentMainDiv = document.getElementById('content');
    const csrfToken = contentMainDiv.getAttribute('data-csrf-token');
    const submitButton = document.getElementById('create-comment-button');
    const taskId = submitButton.getAttribute('data-task-id');  // Task ID

    const formComment = document.getElementById('user-comment-form');
    const userCommentInput = formComment.querySelector('.user-comment-desc-input');
    const fileInputComment = formComment.querySelector('.user-comment-img-input');
    const uploadImageButton = document.getElementById('upload-image-button');
    const imagePreviewContainer = document.getElementById('image-preview-container-comment');

    const taskTitleInput = document.getElementById('task-title-title');


    const fileInputTask = document.getElementById('task-image-input');
    const uploadImageTaskButton = document.getElementById('upload-image-button-near');
    const imagePreviewContainerTask = document.getElementById('image-preview-container-task');

    const paragraphsDiv = document.getElementById('task-paragraph-list');
    const paragraphList = paragraphsDiv.querySelectorAll('.task-paragraph-text'); // Получаем первую форму

    const paragraphListText = [...paragraphsDiv.querySelectorAll('.task-paragraph-text')];

    // Передаём в функцию
    iphoneFix(paragraphListText);
    const paragraphImages = document.querySelectorAll('.task-paragraph-img'); // Получаем все изображения

    paragraphImages.forEach((img) => {
        img.addEventListener('click', () => {
            // Проверяем текущий источник изображения
            const currentSrc = img.getAttribute('src');

            const paragraphOrder = img.getAttribute('data-paragraph-order'); // Получаем порядок параграфа

            let orderStatus = null;
            // Переключаем изображение
            if (currentSrc.includes('paragraph_nc.svg')) {
                img.setAttribute('src', '/static/game/img/tasks/paragraph.svg');
                orderStatus = true;
            } else {
                img.setAttribute('src', '/static/game/img/tasks/paragraph_nc.svg');
                orderStatus = false;
            }
            // Выполняем fetch запрос для обновления состояния
            fetch('tasks/update_paragraph_status/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'X-CSRFToken': csrfToken,
                },
                body: `task_id=${encodeURIComponent(taskId)}&paragraphStatus=${encodeURIComponent(orderStatus)}&paragraphOrder=${encodeURIComponent(paragraphOrder)}`

            })
                .then((response) => {
                    if (response.ok) {
                        console.log('Статус параграфа обновлён');
                    } else {
                        console.error('Ошибка при обновлении статуса параграфа');
                    }
                })
                .catch((error) => console.error('Ошибка запроса:', error));
        });
    });


    var inputsArray = [userCommentInput, taskTitleInput];
    iphoneFix(inputsArray);
    var forms = [formComment];
    forms.forEach((form, index) => {
        if (form) {  // Check if form exists

            // Function to check form completion
            function checkFormCompletion() {
                console.log('input')
                if (userCommentInput.value.trim()) {
                    submitButton.classList.add('completed'); // Add class if fields are filled
                } else {
                    submitButton.classList.remove('completed'); // Remove class if something is not filled
                }
            }

            // Add listeners for fields
            userCommentInput.addEventListener('input', checkFormCompletion);
        }
    });
    var selectedFilesTask = []

    // Fetch images for the task and render them in the preview container
//    taskDescInput.addEventListener('input', function() {
//        autoExpandField(this, 100);
//    });
    userCommentInput.addEventListener('input', function() {
        autoExpandField(this, 100);
    });
    fetch('tasks/info/load_images?task_id=' + encodeURIComponent(taskId), {
        method: 'GET',
        headers: {
            'X-CSRFToken': csrfToken
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            console.log('Изображения загружены успешно.');
            selectedFilesTask = data.image_urls;

            renderImagePreviews(selectedFilesTask, imagePreviewContainerTask, null, fileInputTask);
        } else {
            console.error('Ошибка загрузки изображений:', data.message);
        }
    })
    .catch(error => {
        console.error('Ошибка сети:', error);
    });

    uploadImageTaskButton.addEventListener('click', function() {
        fileInputTask.click(); // Trigger click on hidden input type="file"
    });

    // Handle file selection and preview for task
    fileInputTask.addEventListener('change', function(event) {
        handleFileSelect(event, selectedFilesTask, imagePreviewContainerTask, fileInputTask);
    });

    // Array to store selected files for comment images
    var selectedFilesComment = [];
    // Handle click on "Upload Image" button to trigger file input
    uploadImageButton.addEventListener('click', function() {
        fileInputComment.click(); // Trigger click on hidden input type="file"
    });

    // Handle file selection and preview for comment
    fileInputComment.addEventListener('change', function(event) {
        handleFileSelect(event, selectedFilesComment, imagePreviewContainer, fileInputComment);
    });

    submitButton.addEventListener('click', async function(e) {
        e.preventDefault();
        const success = await handleFormSubmit(formComment, selectedFilesComment, imagePreviewContainer, 'Задача выполнена успешно!', `tasks/create/user_comment/?taskId=${taskId}`);

        if (success) {
            updateBalance(100, csrfToken);
            fetch('tasks/complete/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'X-CSRFToken': csrfToken
                },
                body: `task_id=${encodeURIComponent(taskId)}`
            })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    console.log('Задача успешно завершёна.');
                } else {
                    console.error('Ошибка завершения квеста:', data.message);
                }
            })
            .catch(error => console.error('Ошибка:', error));
        } else {
            console.error('handleFormSubmit завершился с ошибкой.');
        }
    });
    let hasTriggered = false;  // Флаг для отслеживания первого срабатывания

    // Добавление MutationObserver для отслеживания изменений
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.removedNodes.forEach((node) => {
            if (!hasTriggered && node.className !== 'thumbnail' && node.nodeName !== '#text') {  // Проверяем флаг и условие класса
                hasTriggered = true;  // Устанавливаем флаг, чтобы код не срабатывал повторно
                observer.disconnect();  // Отключаем наблюдатель


                const paragraphTexts = Array.from(paragraphList).map(paragraph => paragraph.innerText.trim());

                console.log('Массив текстов параграфов:', paragraphTexts); // Выводим массив в консоль


                const updatedTitle = taskTitleInput.innerText;
                //const updatedDescription = taskDescInput.innerText;
                const updatedImages = selectedFilesTask;

                // Формируем данные для отправки
                const formData = new FormData();
                formData.append('task_id', taskId);
                formData.append('title', updatedTitle);
                formData.append('paragraphTexts', paragraphTexts);

                updatedImages.forEach((file, index) => {
                if (typeof file === 'string') {
                   // Добавляем URL как часть массива image_urls
                   formData.append('image_urls', file);
                } else {
                   // Добавляем файл как часть массива task-images
                   formData.append('task-images', file);
                }
                });
                if (updatedTitle.trim() !== '') {
                if (taskTitle) {
                    taskTitle.textContent = `«${updatedTitle}»`;
                }

                console.log(formData);
                fetch('tasks/edit_task/', {
                    method: 'POST',
                    headers: {
                        'X-CSRFToken': csrfToken
                    },
                    body: formData
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        console.log('Данные успешно сохранены.');
                    } else {
                        console.error('Ошибка сохранения данных:', data.message);
                    }
                })
                .catch(error => {
                    console.error('Ошибка сети при сохранении данных:', error);
                });

                }
                }
            });
        });
    });

    observer.observe(contentMainDiv, {
        childList: true,  // Отслеживаем добавление и удаление дочерних узлов
        subtree: true     // Включаем наблюдение для всех вложенных элементов
    });

    const taskTopFlag = document.querySelectorAll('.favourites');

    taskTopFlag.forEach(img => {
        img.addEventListener('click', function() {

            const currentSrc = img.src;

        if (currentSrc.includes('favourites.svg')) {
            img.src = currentSrc.replace('favourites.svg', 'favourites_ns.svg');
            if (taskTopFlagInList) {
                if (taskTopFlagInList.tagName === "IMG") {
                    taskTopFlagInList.src = currentSrc.replace('favourites.svg', 'favourites_ns.svg');
                } else {
                    // Действие, если taskTopFlagInList — это div
                    console.log("Это div, а не изображение");
                }
            }
            var priority = false;
        } else {
            img.src = currentSrc.replace('favourites_ns.svg', 'favourites.svg');
            if (taskTopFlagInList) {
                if (taskTopFlagInList.tagName === "IMG") {
                    taskTopFlagInList.src = currentSrc.replace('favourites_ns.svg', 'favourites.svg');
                } else {
                    // Действие, если taskTopFlagInList — это div
                    console.log("Это div, а не изображение");
                }
            }
            var priority = true;
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
    });
}



function renderImagePreviews(images, container, inputField, fileInput) {
    container.innerHTML = '';
    console.log(fileInput);

    images.forEach((image, index) => {
        let img = document.createElement('img');

        if (typeof image === 'string') {
            // Если image — строка, то это URL-адрес из БД
            img.src = image;
        } else if (image instanceof File) {
            // Если image — объект File, то создаем URL из файла
            let reader = new FileReader();
            reader.onload = function(e) {
                img.src = e.target.result;
            };
            reader.readAsDataURL(image);
        }

        img.classList.add('thumbnail');
        img.dataset.index = index;

        // Добавляем слушатель на клик для удаления изображения
        img.addEventListener('click', function() {
            if (typeof image === 'string') {
                // Если это URL, удаляем его из массива
                images.splice(index, 1);
            } else if (image instanceof File) {
                // Если это File, удаляем из массива выбранных файлов
                images.splice(index, 1);
                const dataTransfer = new DataTransfer();
                images.forEach(function(file) {
                    if (file instanceof File) {
                        dataTransfer.items.add(file);
                    }
                });
                fileInput.files = dataTransfer.files;
            }

            // Перерисовываем миниатюры
            renderImagePreviews(images, container, inputField, fileInput);
        });

        container.appendChild(img);
    });
    if (inputField){
        // Если изображений нет, сбрасываем max-height
        if (images.length === 0) {
            inputField.style.maxHeight = '';
        }
    }
}

function handleFileSelect(event, selectedFiles, imagePreviewContainer, fileInput) {
    const newFiles = Array.from(event.target.files);
    // Фильтруем новые файлы: добавляем только если это File или строка (URL)
    const combinedFiles = [
        ...selectedFiles.filter(item => typeof item === 'string'), // сохраняем URL-строки
        ...selectedFiles.filter(item => item instanceof File), // сохраняем файлы
        ...newFiles
    ].slice(0, 3); // Ограничиваем до 3 файлов/URL

    // Обновляем массив выбранных файлов и ссылок
    selectedFiles.splice(0, selectedFiles.length, ...combinedFiles);

    // Создаём DataTransfer объект и добавляем только File объекты (пропуская строки URL)
    const dataTransfer = new DataTransfer();
    selectedFiles.forEach(item => {
        if (item instanceof File) {
            dataTransfer.items.add(item);
        }
    });
    fileInput.files = dataTransfer.files;

    // Обновляем миниатюры
    renderImagePreviews(selectedFiles, imagePreviewContainer, null, fileInput);
}


function handleFormSubmit(form, selectedFiles, imagePreviewContainer, successMessage, fetch_url) {
    var formData = new FormData();

    Array.from(form.elements).forEach(function(element) {
        if (element.name && element.type !== 'file') {
            formData.append(element.name, element.value);
        }
    });

    selectedFiles.forEach(function(file) {
        formData.append('images', file);
    });

    return fetch(fetch_url, {
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
            form.reset();
            imagePreviewContainer.innerHTML = '';
            selectedFiles.length = 0;
            loadContent(2);
            return true; // Успех
        } else {
            console.error('Ошибка: ', data.errors);
            return false; // Ошибка
        }
    })
    .catch(error => {
        console.error('Ошибка AJAX запроса: ', error);
        return false; // Ошибка
    });
}


function autoExpandField(field, initialHeight) {
    // Сбрасываем высоту на минимальное значение перед измерением
    field.style.height = initialHeight + 'px';

    // Устанавливаем новую высоту на основе содержимого
    if (field.scrollHeight > initialHeight) {
        field.style.height = field.scrollHeight + 'px';
    }
}

function addForm(containerId) {
    const container = document.getElementById(containerId);
    const totalFormsInput = container.querySelector('input[name$="TOTAL_FORMS"]');
    let totalForms = parseInt(totalFormsInput.value);

    // Найти первый элемент формы для копирования
    const firstForm = container.querySelector('.task-item-form');
    if (!firstForm) return;

    // Создать копию формы
    const newForm = firstForm.cloneNode(true);

    // Очистить содержимое полей новой формы
    const fields = newForm.querySelectorAll('input, select, textarea');
    fields.forEach((field) => {
        if (field.type === 'checkbox' || field.type === 'radio') {
            field.checked = false;
        } else {
            field.value = '';
        }
    });

    // Обновить индексы в новой форме
    updateFormIndex(newForm, totalForms);

    var inputFields = [newForm];
    iphoneFix(inputFields);

    // Привязать обработчик к текстовым полям новой формы
    const textInputs = newForm.querySelectorAll('input[type="text"], textarea');
    textInputs.forEach((input) => {
        input.addEventListener('keydown', (event) => handleKeyDown(event, containerId));
    });

    // Добавить новую форму в контейнер
    container.appendChild(newForm);

    // Увеличить количество форм
    totalFormsInput.value = totalForms + 1;

    // Установить фокус на первое текстовое поле новой формы
    const firstTextInput = newForm.querySelector('input[type="text"], textarea');
    if (firstTextInput) {
        firstTextInput.focus();
    }

    // Обновляем маркеры
    updateMarkerClass(container);
}

function updateFormIndex(form, index) {
    const fields = form.querySelectorAll('input, select, textarea, label');

    fields.forEach((field) => {
        if (field.name) {
            field.name = field.name.replace(/-\d+-/, `-${index}-`);
        }
        if (field.id) {
            field.id = field.id.replace(/-\d+-/, `-${index}-`);
        }
        if (field.htmlFor) {
            field.htmlFor = field.htmlFor.replace(/-\d+-/, `-${index}-`);
        }
    });

    // Устанавливаем порядок как значение скрытого поля, если оно есть
    const orderField = form.querySelector('input[name$="order"]');
    if (orderField) {
        orderField.value = index + 1; // Устанавливаем значение на основе индекса
    }
}

function handleKeyDown(event, containerId) {
    const container = document.getElementById(containerId);

    // Проверяем нажатие Backspace
    if (event.key === 'Backspace') {
        const input = event.target;

        // Если поле пустое, проверяем количество форм
        if (input.value.trim() === '') {
            const forms = container.querySelectorAll('.task-item-form');

            // Если форма только одна, удаление запрещено
            if (forms.length === 1) {
                event.preventDefault(); // Предотвращаем удаление
                return;
            }

            event.preventDefault(); // Предотвращаем стандартное поведение только при удалении формы

            const formToRemove = input.closest('.task-item-form');
            if (formToRemove) {
                // Найти предыдущую форму
                const formIndex = Array.from(forms).indexOf(formToRemove);

                // Если предыдущая форма существует, установите фокус на её текстовое поле
                if (formIndex > 0) {
                    const previousForm = forms[formIndex - 1];
                    const previousTextInput = previousForm.querySelector('input[type="text"], textarea');
                    if (previousTextInput) {
                        previousTextInput.focus();
                    }
                }

                // Удаляем форму
                formToRemove.remove();

                // Обновляем количество форм
                const totalFormsInput = container.querySelector('input[name$="TOTAL_FORMS"]');
                let totalForms = parseInt(totalFormsInput.value);
                totalFormsInput.value = totalForms - 1;

                // Перенумеруем формы, чтобы индексы оставались корректными
                const updatedForms = container.querySelectorAll('.task-item-form');
                updatedForms.forEach((form, index) => {
                    updateFormIndex(form, index);
                });

                // Обновляем маркеры
                updateMarkerClass(container);
            }
        }
    }

    // Проверяем нажатие Enter
    if (event.key === 'Enter') {
        event.preventDefault(); // Предотвращаем стандартное поведение (новый абзац)
        addForm(containerId); // Добавляем новую форму
    }
}

function updateMarkerClass(container) {
    const forms = container.querySelectorAll('.task-item-form');
    const hasMultipleForms = forms.length > 1; // Проверяем, есть ли больше одной формы

    forms.forEach((form) => {
        if (hasMultipleForms) {
            form.classList.add('has-marker'); // Добавляем класс, если больше одной формы
        } else {
            form.classList.remove('has-marker'); // Убираем класс, если форма одна
        }
    });
}
