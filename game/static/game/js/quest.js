// quest.js
function initQuestJS() {
    // Функция для переключения активного класса
    function toggleActive(elementToActivate, elementToDeactivate) {
        elementToDeactivate.classList.remove('active-border');
        elementToActivate.classList.add('active-border');
    }

    // Получаем ссылки на элементы меню и блоки с квестами
    const allQuests = document.getElementById('all-quests');
    const completedQuests = document.getElementById('completed-quests');
    const commonQuestsDiv = document.querySelector('.common-quests-div');
    const completedQuestsDiv = document.querySelector('.completed-quests-div');

    // Проверяем, что элементы существуют
    if (allQuests && completedQuests && commonQuestsDiv && completedQuestsDiv) {
        // Функция для переключения видимости блоков
        function toggleQuests(questsToShow, questsToHide) {
            questsToHide.classList.add('hidden');
            questsToShow.classList.remove('hidden');
        }

        // Добавляем обработчики кликов для переключения классов и блоков
        allQuests.addEventListener('click', function() {
            toggleActive(allQuests, completedQuests);
            toggleQuests(commonQuestsDiv, completedQuestsDiv);
        });

        completedQuests.addEventListener('click', function() {
            toggleActive(completedQuests, allQuests);
            toggleQuests(completedQuestsDiv, commonQuestsDiv);
        });
    } else {
        console.error('Элементы не найдены, скрипт initQuestJS не может быть выполнен.');
    }
}
function initSeeQuestJS() {
    const allQuests = document.querySelectorAll('.quest-content'); // Находим все элементы с классом 'quest-content'

    if (allQuests.length > 0) {
        allQuests.forEach(quest => {
            quest.addEventListener('click', function() {
                // Извлекаем ID квеста из атрибута data-quest-id
                let questId = quest.getAttribute('data-quest-id');

                if (questId) {
                    // Отправляем запрос с ID квеста на сервер
                    fetch('quests/see_quest/?quest_id=' + encodeURIComponent(questId))
                        .then(response => response.text())
                        .then(html => {
                            document.getElementById('content').innerHTML = html; // Обновляем содержимое страницы
                        })
                        .catch(error => {
                            console.error("Ошибка при загрузке формы: ", error);
                        });
                } else {
                    console.error("Не удалось извлечь ID квеста.");
                }
            });
        });
    } else {
        console.log("Элементы квестов не найдены.");
    }
}
