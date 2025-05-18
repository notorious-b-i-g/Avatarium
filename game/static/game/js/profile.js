function initProfileJS() {
    const saveChangesButton = document.getElementById('save-changes-button');
    const profileForm = document.getElementById('profile-form');
    const editProfileButton = document.getElementById('edit-profile-button');
    const profileModal = document.getElementById('profile-modal');
    const closeButton = document.querySelector('.close-button');

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

    const contentMainDiv = document.getElementById('content');
    const csrfToken = contentMainDiv.getAttribute('data-csrf-token');

    const nameInput = document.getElementById('name');
    const phoneInput = document.getElementById('phone');
    const emailInput = document.getElementById('email');
    const genderInput = document.getElementById('gender');
    const birthdayInput = document.getElementById('date_of_birth');
    const inputFields = [nameInput, phoneInput, emailInput, genderInput, birthdayInput];

    const profileContent = document.getElementById('profile-content');
    const faqDiv = document.getElementById('faq-div');
    const questionsAnswersButton = document.getElementById('questions-answers');

    iphoneFix(inputFields);

    if (!saveChangesButton || !profileForm || !profileModal || !closeButton) {
        console.error('Необходимые элементы для профиля не найдены, скрипт initProfileJS не может быть выполнен.');
        return;
    }

    // Обработчик для кнопки "Редактировать профиль"
    editProfileButton.addEventListener('click', function(event) {
        event.preventDefault();
        profileContent.classList.add('hidden');
        profileModal.classList.remove('hidden');
    });

    // Обработчик для кнопки "Сохранить изменения"
    saveChangesButton.addEventListener('click', function(event) {
        event.preventDefault();

        // Добавление CSRF-токена в заголовок запроса

        // Собираем данные формы
        const formData = new FormData(profileForm);
        profileContent.classList.remove('hidden');

        // Отправляем AJAX-запрос для сохранения данных
        fetch('update_profile/', {
            method: 'POST',
            headers: {
                'X-CSRFToken': csrfToken
            },
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Профиль успешно обновлен!');
                profileModal.classList.add('hidden');
            } else {
                alert('Ошибка при обновлении профиля: ' + data.message);
            }
        })
        .catch(error => {
            alert('Ошибка при заполнении поля профиля');
            console.error('Ошибка при обновлении профиля:', error);
        });
    });

    // Обработчик для кнопки закрытия модального окна
    closeButton.addEventListener('click', function() {
        profileModal.classList.add('hidden');
        profileContent.classList.remove('hidden');

    });

    // Обработчик для кнопки закрытия модального окна
    questionsAnswersButton.addEventListener('click', function() {
        console.log('question');
        profileContent.classList.add('hidden');
        faqDiv.classList.remove('hidden');
    });


    const closeButtonFAQ = document.getElementById('close-button-faq');
    closeButtonFAQ.addEventListener('click', function() {
        profileContent.classList.remove('hidden');
        faqDiv.classList.add('hidden');
    });


    if (!addAvatarButton || !avatarModal || !closeModal || !uploadPhotoButton || !takePhotoButton ||
        !avatarFileInput || !uploadAvatarForm || !cameraContainer || !videoElement || !captureButton) {
        console.error('Необходимые элементы для аватара не найдены, скрипт initAvatarJS не может быть выполнен.');
        return;
    }



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

}

