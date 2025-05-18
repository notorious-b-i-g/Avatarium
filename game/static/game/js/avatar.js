// avatar.js


function initAvatarJS() {
    const addAvatarButton = document.getElementById('add-avatar-button');
    const avatarModal = document.getElementById('avatar-modal');
    const closeModal = document.getElementById('close-modal');
    const takePhotoButton = document.getElementById('photo-container-make');
    const uploadPhotoButton = document.getElementById('photo-container-load');
    const avatarFileInput = document.getElementById('avatar-file-input');
    const uploadAvatarForm = document.getElementById('upload-avatar-form');
    const cameraContainer = document.getElementById('camera-container');
    const videoElement = document.getElementById('video');
    const captureButton = document.getElementById('capture-button');
    const button = document.getElementById('game-button');

    button.addEventListener('click', function() {
        loadContent(2);
    });
    
    const yearChallengeButton = document.getElementById('year-govno-jopa');

    yearChallengeButton.addEventListener('click', function() {
        loadContent(6);
    });
    if (!addAvatarButton || !avatarModal || !closeModal || !uploadPhotoButton || !takePhotoButton ||
        !avatarFileInput || !uploadAvatarForm || !cameraContainer || !videoElement || !captureButton) {
        console.error('Необходимые элементы для аватара не найдены, скрипт initAvatarJS не может быть выполнен.');
        return;
    }

    const csrfTokenInput = uploadAvatarForm.querySelector('input[name="csrfmiddlewaretoken"]');
    const csrfToken = csrfTokenInput ? csrfTokenInput.value : '';


    // Функция для открытия модального окна
    function openModal() {
        avatarModal.style.display = 'block';
    }

    // Функция для закрытия модального окна
    function closeModalWindow() {
        avatarModal.style.display = 'none';
        resetModal();
    }

    // Функция для сброса модального окна к первоначальному состоянию
    function resetModal() {
        uploadPhotoButton.style.display = 'flex';
        takePhotoButton.style.display = 'flex';
        cameraContainer.style.display = 'none';

        // Останавливаем видеопоток, если он активен
        if (videoElement && videoElement.srcObject) {
            videoElement.srcObject.getTracks().forEach(track => track.stop());
            videoElement.srcObject = null;
        }
    }

    // Обработчик для кнопки открытия модального окна
    addAvatarButton.addEventListener('click', function() {
        openModal();
    });

    // Обработчик для кнопки закрытия модального окна
    closeModal.addEventListener('click', function() {
        closeModalWindow();
    });

    // Закрытие модального окна при клике вне его содержимого
    window.addEventListener('click', function(event) {
        if (event.target === avatarModal) {
            closeModalWindow();
        }
    });

    // Обработчик для кнопки "Загрузить фото"
    uploadPhotoButton.addEventListener('click', function() {
        avatarFileInput.click();
    });

    // Обработка выбора файла для загрузки аватара
    avatarFileInput.addEventListener('change', function() {
        const formData = new FormData(uploadAvatarForm);

        fetch('update_avatar/', {
            method: 'POST',
            headers: {
                'X-CSRFToken': csrfToken
            },
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const avatarImage = document.querySelector('.ava');
                if (avatarImage) {
                    avatarImage.src = data.avatar_url + '?t=' + new Date().getTime(); // Добавляем параметр для сброса кэша
                }
                closeModalWindow();
            } else {
                alert('Ошибка при загрузке аватара: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Ошибка при загрузке аватара:', error);
        });
    });

    // Обработчик для кнопки "Сделать снимок"
    takePhotoButton.addEventListener('click', function() {
        uploadPhotoButton.style.display = 'none';
        takePhotoButton.style.display = 'none';
        cameraContainer.style.display = 'block';

        navigator.mediaDevices.getUserMedia({ video: true })
            .then(function(stream) {
                videoElement.srcObject = stream;
                videoElement.play();
            })
            .catch(function(err) {
                console.error('Ошибка доступа к камере:', err);
                alert('Не удалось получить доступ к камере.');
                resetModal();
            });
    });

    // Обработчик для кнопки "Сделать снимок" в режиме камеры
    captureButton.addEventListener('click', function() {
        const canvas = document.createElement('canvas');
        canvas.width = videoElement.videoWidth;
        canvas.height = videoElement.videoHeight;

        const context = canvas.getContext('2d');
        context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

        // Останавливаем видеопоток
        if (videoElement.srcObject) {
            videoElement.srcObject.getTracks().forEach(track => track.stop());
            videoElement.srcObject = null;
        }

        // Получаем данные изображения и отправляем на сервер
        canvas.toBlob(function(blob) {
            const formData = new FormData();
            formData.append('avatar', blob, 'avatar.jpg');

            fetch('update_avatar/', {
                method: 'POST',
                headers: {
                    'X-CSRFToken': csrfToken
                },
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    const avatarImage = document.querySelector('.ava');
                    if (avatarImage) {
                        avatarImage.src = data.avatar_url + '?t=' + new Date().getTime(); // Обновляем аватар на странице
                    }
                    closeModalWindow();
                } else {
                    alert('Ошибка при загрузке аватара: ' + data.message);
                }
            })
            .catch(error => {
                console.error('Ошибка при загрузке аватара:', error);
            });
        }, 'image/jpeg');
    });

    const sliderContent = document.getElementById('slider-content');
    const sliderItems = sliderContent.querySelectorAll('.slider-item');
    const progressBar = document.getElementById('progress-bar');

    if (!sliderContent || sliderItems.length === 0 || !progressBar) {
        console.error('Элементы слайдера не найдены, инициализация невозможна.');
        return;
    }

    let currentIndex = 0;
    const totalItems = sliderItems.length;
    let sliderInterval;
    const slideDuration = 5000; // Продолжительность каждого слайда в миллисекундах

    // Создание сегментов прогресс-бара
    for (let i = 0; i < totalItems; i++) {
        const progressSegment = document.createElement('div');
        progressSegment.classList.add('progress-segment');
        progressSegment.dataset.index = i;

        // Добавляем обработчик клика для сегмента
        progressSegment.addEventListener('click', function() {
            clearInterval(sliderInterval); // Останавливаем автоматическое переключение
            goToSlide(i);
            startSlider(); // Перезапускаем автоматическое переключение, если необходимо
        });

        progressBar.appendChild(progressSegment);
    }

    const progressSegments = progressBar.querySelectorAll('.progress-segment');

    function showSlide(index) {
        // Скрываем все слайды
        sliderItems.forEach(item => {
            item.classList.add('hidden');
        });

        // Убираем активный класс у всех сегментов прогресс-бара
        progressSegments.forEach(segment => {
            segment.classList.remove('active');
            segment.style.width = '0%';
            segment.classList.remove('animate');
        });

        // Показываем текущий слайд
        sliderItems[index].classList.remove('hidden');

        // Активируем соответствующий сегмент прогресс-бара
        progressSegments[index].classList.add('active');
        progressSegments[index].classList.add('animate');
    }

    function goToSlide(index) {
        currentIndex = index;
        showSlide(currentIndex);
    }

    function nextSlide() {
        currentIndex = (currentIndex + 1) % totalItems;
        showSlide(currentIndex);
    }

    function startSlider() {
        sliderInterval = setInterval(() => {
            nextSlide();
        }, slideDuration);
    }

    // Инициализация слайдера
    showSlide(currentIndex);
    startSlider();

    const clickerDiv = document.getElementById('clicker-container');

    const topUncompletedTask = document.getElementById('top-uncompleted-task');
    const taskInfo = document.getElementById('task-info');
    const taskInfoDiv = document.getElementById('task-info-div');
    if (topUncompletedTask) {
        topUncompletedTask.addEventListener('click', function(event) {
        let taskId = topUncompletedTask.getAttribute('data-task-id');
        if (taskId) {
            ShowAndHideLoadingScreen('info');
            clickerDiv.classList.add('hidden');
            taskInfo.classList.remove('hidden');
            // Отправляем запрос на сервер для получения информации о задаче
            fetch('tasks/see_task/?task_id=' + encodeURIComponent(taskId))
                .then(response => response.text())
                .then(html => {
                    // Обновляем содержимое task-info-div
                    taskInfoDiv.innerHTML = html;


                    initSeeTaskJS(null, null);

                    // Инициализируем дополнительные обработчики, если необходимо
                })
                .catch(error => {
                    console.error("Ошибка при загрузке информации о задаче: ", error);
                });
        } else {
            console.error("Не удалось извлечь ID задачи.");
        }

        });
    }
    const goBackButtonTask = document.getElementById('goback-button-task');
    goBackButtonTask.addEventListener('click', function() {
        // Очищаем содержимое task-info-div
        taskInfoDiv.innerHTML = '';

        taskInfo.classList.add('hidden');
        clickerDiv.classList.remove('hidden');

        // Добавляем класс hidden к task-create-menu

    });
    const topUncompletedQuest = document.getElementById('top-uncompleted-quest');
    const questInfo = document.getElementById('quest-info');
    const questInfoDiv = document.getElementById('quest-info-div');
    if (topUncompletedQuest) {
        topUncompletedQuest.addEventListener('click', function() {

        // Извлекаем ID квеста из атрибута data-quest-id
        let questId = topUncompletedQuest.getAttribute('data-quest-id');

        if (questId) {
            // Добавляем класс 'hidden' для questMenu
            ShowAndHideLoadingScreen('quest_info')
            clickerDiv.classList.add('hidden');
            questInfo.classList.remove('hidden');
            // Отправляем запрос с ID квеста на сервер
            fetch('quests/see_quest/?quest_id=' + encodeURIComponent(questId))
                .then(response => response.text())
                .then(html => {
                    // Обновляем содержимое quest-info
                    questInfoDiv.innerHTML = html;

                    // Инициализируем обработку кнопки "Назад" после добавления нового контента
                    initSeeQuestJS(clickerDiv);

                })
                .catch(error => {
                    console.error("Ошибка при загрузке формы: ", error);
                });
        } else {
            console.error("Не удалось извлечь ID квеста.");
        }
    });

    } else {
        console.log("Элементы квестов не найдены.");
    }
}
