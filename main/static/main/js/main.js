let blockNumber = 1;

// Функция для переключения блоков
function loadNextImage() {
    // Скрываем текущий блок
    document.querySelector('.block-content.active').classList.remove('active');

    // Увеличиваем номер блока
    blockNumber++;
    if (blockNumber > 3) blockNumber = 1;  // Если превышен номер блока, возвращаемся к 1

    // Отображаем следующий блок
    document.getElementById('block' + blockNumber).classList.add('active');
}
function redirectToGame() {
    window.location.href = '/game';
}
