function loadAnotherPage(pageIndex) {
    // Получаем все блоки
    const blocks = document.querySelectorAll('.block-content');

    // Удаляем класс 'active' у всех блоков, скрывая их
    blocks.forEach(block => {
        block.classList.remove('active');
    });

    // Находим нужный блок по id и добавляем ему класс 'active', чтобы его отобразить
    const activeBlock = document.getElementById(`block${pageIndex}`);
    if (activeBlock) {
        activeBlock.classList.add('active');
    }
}

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

