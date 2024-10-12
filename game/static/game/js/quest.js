function initQuestJS() {
    // Функция для переключения активного класса
    function toggleActive(elementToActivate, elementToDeactivate) {
        elementToDeactivate.classList.remove('active-border');
        elementToActivate.classList.add('active-border');
    }

    // Функция для переключения видимости блоков
    function toggleQuests(questsToShow, questsToHide) {
        questsToHide.classList.add('hidden');
        questsToShow.classList.remove('hidden');
    }

    // Получаем ссылки на элементы меню и блоки с квестами
    const allQuests = document.getElementById('all-quests');
    const completedQuests = document.getElementById('completed-quests');
    const commonQuestsDiv = document.querySelector('.common-quests-div');
    const completedQuestsDiv = document.querySelector('.completed-quests-div');

    // Проверяем, что элементы существуют для переключения квестов
    if (allQuests && completedQuests && commonQuestsDiv && completedQuestsDiv) {
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
        console.error('Элементы меню квестов не найдены, скрипт не может быть выполнен.');
    }

    // Функция для отображения информации о квесте и скрытия списка квестов
    const allQuestItems = document.querySelectorAll('.quest-content'); // Находим все элементы с классом 'quest-content'
    const questMenu = document.getElementById('quest-list'); // Элемент с ID 'quest-list'
    const questInfo = document.getElementById('quest-info'); // Элемент с ID 'quest-info'

    // Проверяем, есть ли элементы с классом 'quest-content'
    if (allQuestItems.length > 0) {
        allQuestItems.forEach(quest => {
            quest.addEventListener('click', function() {
                // Извлекаем ID квеста из атрибута data-quest-id
                let questId = quest.getAttribute('data-quest-id');

                if (questId) {
                    // Добавляем класс 'hidden' для questMenu
                    questMenu.classList.add('hidden');

                    // Отправляем запрос с ID квеста на сервер
                    fetch('quests/see_quest/?quest_id=' + encodeURIComponent(questId))
                        .then(response => response.text())
                        .then(html => {
                            // Обновляем содержимое quest-info
                            questInfo.innerHTML = html;

                            // Инициализируем обработку кнопки "Назад" после добавления нового контента
                            initSeeQuestJS();
                            initBalanceJS();

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

// Функция для инициализации кнопки "Назад"
function initSeeQuestJS() {
    const questMenu = document.getElementById('quest-list'); // Элемент с ID 'quest-list'
    const questInfo = document.getElementById('quest-info'); // Элемент с ID 'quest-info'
    const backButton = document.getElementById('goback-button'); // Элемент с ID 'goback-button'

    // Добавляем обработчик события на кнопку 'goback-button'
    if (backButton) {
        backButton.addEventListener('click', function() {
            // Очищаем содержимое quest-info
            questInfo.innerHTML = '';

            // Убираем класс 'hidden' у questMenu
            questMenu.classList.remove('hidden');
        });
    }
}
