// main.js
function loadContent(tab) {
    var page = '';
    if(tab == '0') {
        page = 'index';  // URL, настроенный в Django urls.py
    } else if(tab == '1') {
        page = 'quest';  // URL, настроенный в Django urls.py
    } else if(tab == '2') {
        page = 'tasks';  // URL, настроенный в Django urls.py
    }
    var xhr = new XMLHttpRequest();
    xhr.open('GET', page, true);
    xhr.onreadystatechange = function () {
        if(xhr.readyState == 4 && xhr.status == 200) {
            document.getElementById('content').innerHTML = xhr.responseText;
            // Обновляем URL без перезагрузки страницы
            history.pushState(null, '' + tab);

            // Инициализируем скрипты для загруженного контента
            if (page === 'quest') {
                initQuestJS();
            } else if(page === 'tasks') {
                initTasksJS();
            }
        }
    };
    xhr.send();
}

// Загрузка контента при загрузке страницы
window.onload = function() {
    loadContent(2);
};
