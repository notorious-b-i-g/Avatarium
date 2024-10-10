document.getElementById('task-create-panel').addEventListener('click', function(e) {
    e.preventDefault(); // Предотвращаем обычный переход по ссылке

    fetch('tasks/create/')
        .then(response => response.text())
        .then(html => {
            document.getElementById('content').innerHTML = html;
        })
        .catch(error => {
            console.error("Ошибка при загрузке формы: ", error);
        });
});
