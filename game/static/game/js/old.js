    const taskTopFlag = document.querySelectorAll('.favourites');
    console.log(taskTopFlag);
    taskTopFlag.forEach(img => {
        img.addEventListener('click', function() {

            const taskId = img.getAttribute('data-task-id');
            const currentSrc = img.src;

            if (currentSrc.includes('favourites.svg')) {
                img.src = currentSrc.replace('favourites.svg', 'favourites_ns.svg');
                task.src = currentSrc.replace('favourites.svg', 'favourites_ns.svg');
                var priority = false;
            } else {
                img.src = currentSrc.replace('favourites_ns.svg', 'favourites.svg');
                task.src = currentSrc.replace('favourites_ns.svg', 'favourites.svg');
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