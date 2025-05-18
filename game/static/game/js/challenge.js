function initChallengeJS() {
    // Получение CSRF-токена из элемента с id 'content'
    const contentMainDiv = document.getElementById('content');
    const csrfToken = contentMainDiv ? contentMainDiv.getAttribute('data-csrf-token') : '';

    const dailyTaskList = document.querySelectorAll('.name-input-challenge');
    const weekChallenge = document.querySelector('.weekly-input-challenge');
    var inputFields = [dailyTaskList, weekChallenge];
    iphoneFix(inputFields)

    const completeAllDayImg = document.getElementById('complete-all-day-img');

    completeAllDayImg.addEventListener('click', function() {
        var currentSrc = completeAllDayImg.src;
        let completed;
        if (currentSrc.includes('day_circle_nc.svg')) {
            completeAllDayImg.src = currentSrc.replace('day_circle_nc.svg', 'day_circle.svg');
            completed = false;
        } else {
            completeAllDayImg.src = currentSrc.replace('day_circle.svg', 'day_circle_nc.svg');
            completed = true;
        }

        toggleTaskStatus(null, completed, false);

    });


    function saveTaskName(taskId, newName) {
        fetch('challenge/update_task_name/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken // Добавление CSRF-токена
            },
            body: JSON.stringify({ task_id: taskId, title: newName })
        })
        .then(res => res.json())
        .then(data => {
            if (!data.success) {
                console.error('Ошибка при сохранении названия задачи');
            }
        })
        .catch(() => {
            console.error('Ошибка при сохранении названия задачи (исключение)');
        });
    }

    function saveWeeklyChallenge(newText) {
        fetch('challenge/update_weekly_challenge/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken // Добавление CSRF-токена
            },
            body: JSON.stringify({ challenge_text: newText })
        })
        .then(res => res.json())
        .then(data => {
            if (!data.success) {
                console.error('Ошибка при сохранении недельного челленджа');
            }
        })
        .catch(() => {
            console.error('Ошибка при сохранении недельного челленджа (исключение)');
        });
    }

    function toggleTaskStatus(taskId, completed, WeekOrDay) {
        fetch('challenge/toggle_task_status/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken // Добавление CSRF-токена
            },
            body: JSON.stringify({ task_id: taskId, completed: !completed, dayly_task_update: WeekOrDay })
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                if (WeekOrDay){
                    const item = document.querySelector(`.item-challenge[data-task-id="${taskId}"] .status-container-challenge`);
                    if (item) {
                        item.setAttribute('data-completed', data.completed);
                        if (data.completed) {
                            item.innerHTML = '<div class="status-check-challenge"></div>';
                        } else {
                            item.innerHTML = '<div class="status-circle-challenge"></div>';
                        }
                    }
                }
                updateWeeklyChart(data.week_data);
            } else {
                console.error('Ошибка при обновлении статуса задачи');
            }
        })
        .catch(() => {
            console.error('Ошибка при обновлении статуса задачи (исключение)');
        });
    }

    function updateWeeklyChart(weekData) {
        const today = new Date().getUTCDay(); // Получаем текущий день недели по UTC (0 - воскресенье, 1 - понедельник, ...)
        const dayIndex = today === 0 ? 6 : today - 1; // Приводим индекс к диапазону [0-6], где 0 - понедельник, 6 - воскресенье

        const bar = document.querySelectorAll('.bar-challenge')[dayIndex]; // Получаем bar для текущего дня
        const dayData = weekData[dayIndex];
        if (!bar) {
            console.error('Bar for today not found');
            return;
        }

        if (!dayData || dayData.completed_count === 0) {
            bar.classList.remove('has-tasks-challenge');
            bar.classList.add('no-tasks-challenge');
            bar.style.height = 'auto';
            bar.innerHTML = '<div class="point-bar-challenge"></div>';
        } else {
            bar.classList.remove('no-tasks-challenge');
            bar.classList.add('has-tasks-challenge');
            console.log(dayData.completed_count);
            const h = dayData.completed_count * 7;
            bar.style.height = h + 'px';
            bar.innerHTML = '<div class="fill-bar-challenge"></div>';
        }
    }



    // Сохранение названия задачи при blur или нажатии Enter
    document.querySelectorAll('.item-challenge .name-input-challenge').forEach(input => {
        input.addEventListener('blur', () => {
            const taskId = input.closest('.item-challenge').getAttribute('data-task-id');
            saveTaskName(taskId, input.value.trim());
        });
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const taskId = input.closest('.item-challenge').getAttribute('data-task-id');
                saveTaskName(taskId, input.value.trim());
                input.blur();
            }
        });
    });

    // Сохранение недельного челленджа
    const weeklyChallengeInput = document.getElementById('weekly-input-challenge');
    if (weeklyChallengeInput) {
        weeklyChallengeInput.addEventListener('blur', () => {
            saveWeeklyChallenge(weeklyChallengeInput.value.trim());
        });
        weeklyChallengeInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                saveWeeklyChallenge(weeklyChallengeInput.value.trim());
                weeklyChallengeInput.blur();
            }
        });
    }

    // Переключение статуса задач
    document.querySelectorAll('.item-challenge .status-container-challenge').forEach(statusContainer => {
        statusContainer.addEventListener('click', () => {
            const taskId = statusContainer.closest('.item-challenge').getAttribute('data-task-id');
            const completed = statusContainer.getAttribute('data-completed') === 'true';
            toggleTaskStatus(taskId, completed, true);
        });
    });

    const gotoCounterDiv = document.getElementById('custom-button7');
    gotoCounterDiv.addEventListener('click', function() {
        console.log(123);
        loadContent(7);
    });
}
