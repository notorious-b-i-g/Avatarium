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
                        // Очищаем текущий список задач и вставляем новый HTML от сервера
                        newBlock.querySelector('#task-list').innerHTML = html;

                        // Скрываем блок категорий и показываем блок задач
                        toggleVisibility(newBlock, categoriesDiv);
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
