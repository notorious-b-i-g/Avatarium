function initCounterJS() {
    console.log(2281488);
    const addCounterButton = document.querySelector('.add-counter-div');
    const counterMenuDiv = document.getElementById('counter-menu-div');
    const cancellationButton = document.getElementById('cancellation-button');
    const createCounterButton = document.getElementById('create-counter-button');
    // Кнопка "создать счетчик целей"
    const createTargetCounterButton = document.getElementById('create-target-counter-button');
    const inputName = document.getElementById('id_name');
    const targetInput = document.querySelector('#counter-stats-line-target .counter-quantity-input');
    const countersList = document.getElementById('counters-list');
    const contentMainDiv = document.getElementById('content');
    const csrfToken = contentMainDiv.getAttribute('data-csrf-token');

    // Функция создания счётчика (одинаковая для обеих кнопок)
    function createCounterHandler() {
        const name = inputName.value.trim();
        const target = parseInt(targetInput.value.trim());
        if (!name || isNaN(target) || target <= 0) {
            alert('Введите корректное название и количество.');
            return;
        }
        fetch('create_counter/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken,
            },
            body: JSON.stringify({ name: name, target: target })
        })
        .then(response => response.json())
        .then(data => {
            addCounterToList(data);
            counterMenuDiv.classList.add('hidden');
        })
        .catch(error => {
            console.error('Ошибка:', error);
        });
    }

    addCounterButton.addEventListener('click', function () {
        counterMenuDiv.classList.remove('hidden');
        inputName.value = '';
        targetInput.value = '';
    });

    cancellationButton.addEventListener('click', function () {
        counterMenuDiv.classList.add('hidden');
    });

    createCounterButton.addEventListener('click', createCounterHandler);
    if (createTargetCounterButton) {
        createTargetCounterButton.addEventListener('click', createCounterHandler);
    }

    function addCounterToList(counterData) {
        const counterDiv = document.createElement('div');
        counterDiv.classList.add('counter');
        counterDiv.setAttribute('data-counter-id', counterData.id);
        counterDiv.setAttribute('data-counter-score', counterData.score);
        counterDiv.setAttribute('data-counter-target', counterData.target);

        const counterStatsDiv = document.createElement('div');
        counterStatsDiv.classList.add('counter-data-div');

        const counterStats = document.createElement('p');
        counterStats.classList.add('counter-score');
        counterStats.textContent = `${counterData.score}/${counterData.target}`; // Заполняем данными


        const nameP = document.createElement('p');
        nameP.classList.add('counter-name');
        nameP.textContent = counterData.name;

        counterStatsDiv.appendChild(nameP);
        counterStatsDiv.appendChild(counterStats); // Добавляем счет в statsDiv

        counterDiv.appendChild(counterStatsDiv); // Теперь statsDiv добавляется сразу после имени

        // Создаем элемент кнопки "+1" как span (новый формат)
        const incrementSpan = document.createElement('span');
        incrementSpan.classList.add('increment-button');
        incrementSpan.textContent = '+1';

        counterDiv.appendChild(incrementSpan); // Добавляем кнопку после statsDiv

        // Создаем кнопку редактирования в виде изображения
        const editImg = document.createElement('img');
        editImg.classList.add('edit-button');
        editImg.src = '/static/game/img/counter/arrow.svg'; // Укажите корректный путь к изображению
        counterDiv.appendChild(editImg);

        countersList.appendChild(counterDiv);

        incrementSpan.addEventListener('click', handleIncrement);
        editImg.addEventListener('click', handleEdit);
    }

    // Функция обновления градиента на основе прогресса
    function paintGradientCounter(counterDiv) {
        console.log('paint');
        const score = parseInt(counterDiv.getAttribute('data-counter-score'));
        const target = parseInt(counterDiv.getAttribute('data-counter-target'));

        if (isNaN(score) || isNaN(target) || target <= 0) return; // Проверка на корректные данные

        const percentage = Math.min((score / target) * 100, 100); // Ограничиваем 100%

        counterDiv.style.background = `linear-gradient(90deg, #B0DBFF 0%, #12B3D9 ${percentage}%, #ffffff ${percentage}%)`;
    }


    // Функция обработки нажатия +1
    function handleIncrement(event) {
        event.stopPropagation(); // Останавливаем всплытие

        const counterDiv = event.target.closest('.counter');
        const counterId = counterDiv.getAttribute('data-counter-id');
        const counterScoreElem = counterDiv.querySelector('.counter-score');

        fetch('increment_counter/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken,
            },
            body: JSON.stringify({ counter_id: counterId })
        })
        .then(response => response.json())
        .then(data => {
            if (data.completed) {
                counterDiv.remove(); // Если достигнута цель, удаляем счетчик
            } else {
                // Обновляем атрибуты и UI
                counterDiv.setAttribute('data-counter-score', data.score);
                if (counterScoreElem) {
                    counterScoreElem.textContent = `${data.score}/${data.target}`;
                }
                paintGradientCounter(counterDiv); // Обновляем градиент
            }
        })
        .catch(error => {
            console.error('Ошибка:', error);
        });
    }


    // Элементы редактирования счётчика
    const editMenuDiv = document.getElementById('counter-edit-menu-div');
    const editCancellationButton = document.getElementById('edit-cancellation-button');
    const editCounterButton = document.getElementById('edit-counter-button');
    const editInputName = document.getElementById('edit_id_name');
    const editTargetInput = document.querySelector('#edit-counter-stats-line-target .counter-quantity-input');
    const removeCounterButton = document.getElementById('remove-counter');

    let currentEditingCounter = null;

    // Применяем iphoneFix ко всем input-полям
    var inputFields = [targetInput, inputName, editInputName, editTargetInput];
    iphoneFix(inputFields);

    // Обработчик кнопки "Изменить"
    function handleEdit(event) {
        const counterDiv = event.target.closest('.counter');
        currentEditingCounter = counterDiv;
        const currentScore = counterDiv.getAttribute('data-counter-score');
        const currentTarget = counterDiv.getAttribute('data-counter-target');
        const currentName = counterDiv.querySelector('.counter-name').textContent;

        editInputName.value = currentName;
        editTargetInput.value = currentTarget;
        // Заполняем поле со значением счёта в форме редактирования, если оно существует
        const editScoreElem = document.getElementById('counter-quantity-data-current');
        if (editScoreElem) {
            editScoreElem.textContent = currentScore;
        }
        editMenuDiv.classList.remove('hidden');
    }

    editCancellationButton.addEventListener('click', function () {
        editMenuDiv.classList.add('hidden');
        currentEditingCounter = null;
    });

    // Обработчик кнопки "Готово" в режиме редактирования
    editCounterButton.addEventListener('click', function () {
        const newName = editInputName.value.trim();
        const newTarget = parseInt(editTargetInput.value.trim());
        if (!newName || isNaN(newTarget) || newTarget <= 0) {
            alert('Введите корректное название и количество.');
            return;
        }
        const counterId = currentEditingCounter.getAttribute('data-counter-id');
        fetch('update_counter/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken,
            },
            body: JSON.stringify({ counter_id: counterId, name: newName, target: newTarget })
        })
        .then(response => response.json())
        .then(data => {
            // Обновляем только имя и целевое значение в data-атрибутах
            currentEditingCounter.querySelector('.counter-name').textContent = data.name;
            currentEditingCounter.setAttribute('data-counter-target', data.target);
            editMenuDiv.classList.add('hidden');
            currentEditingCounter = null;
        })
        .catch(error => {
            console.error('Ошибка:', error);
        });
    });

    if (removeCounterButton) {
        removeCounterButton.addEventListener('click', function () {
            if (currentEditingCounter) {
                const counterId = currentEditingCounter.getAttribute('data-counter-id');
                fetch('delete_counter/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': csrfToken,
                    },
                    body: JSON.stringify({ counter_id: counterId })
                })
                .then(response => response.json())
                .then(data => {
                    if (data.deleted) {
                        currentEditingCounter.remove();
                        editMenuDiv.classList.add('hidden');
                        currentEditingCounter = null;
                    }
                })
                .catch(error => {
                    console.error('Ошибка:', error);
                });
            }
        });
    }

    document.querySelectorAll('.increment-button').forEach(button => {
        button.addEventListener('click', handleIncrement);
    });
    document.querySelectorAll('.counter').forEach(button => {
        button.addEventListener('click', handleEdit);
        paintGradientCounter(button);

    });

}
