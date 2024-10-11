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
    if (taskCreatePanel) {
        taskCreatePanel.addEventListener('click', function(e) {
            e.preventDefault(); // Предотвращаем стандартное поведение

            // Извлекаем task_category из класса элемента
            let classList = taskCreatePanel.classList;
            let taskCategory = taskCreatePanel.classList[1];

            // Отправляем task_category в запросе на сервер
            fetch('tasks/create/?task_category=' + encodeURIComponent(taskCategory))
                .then(response => response.text())
                .then(html => {
                    document.getElementById('content').innerHTML = html;
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



function initTaskFormJS(){
    var form = document.getElementById('create-task-form');
    console.log(form)
    form.addEventListener('submit', function(e) {
        e.preventDefault();  // Отменяем стандартное поведение формы
        var formData = new FormData(form);

        fetch('tasks/create/', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                console.log('Задача создана успешно');
                // Опционально: обновите UI или перенаправьте пользователя
            } else {
                console.error('Ошибка: ' + data.error);
            }
        })
        .catch(error => console.error('Ошибка AJAX запроса: ', error));
    });

}