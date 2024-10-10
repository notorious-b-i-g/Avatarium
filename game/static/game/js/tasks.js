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
function initTasksCreateJS(){
    const TaskCreatePanel = document.getElementById('task-create-panel');
    console.log(TaskCreatePanel);
    TaskCreatePanel.addEventListener('click', function(e) {
    e.preventDefault(); // Предотвращаем обычный переход по ссылке
    console.log(1)
    fetch('tasks/create/')
        .then(response => response.text())
        .then(html => {
            document.getElementById('content').innerHTML = html;
            initTaskFormJS(); // Вызов функции инициализации формы сразу после загрузки HTML

        })
        .catch(error => {
            console.error("Ошибка при загрузке формы: ", error);
        });
})

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