function initLibraryJS(){

    const sliderContent = document.getElementById('slider-content');
    const sliderItems = sliderContent.querySelectorAll('.slider-item');
    const progressBar = document.getElementById('progress-bar');

    if (!sliderContent || sliderItems.length === 0 || !progressBar) {
        console.error('Элементы слайдера не найдены, инициализация невозможна.');
        return;
    }

    let currentIndex = 0;
    const totalItems = sliderItems.length;
    let sliderInterval;
    const slideDuration = 5000; // Продолжительность каждого слайда в миллисекундах

    // Создание сегментов прогресс-бара
    for (let i = 0; i < totalItems; i++) {
        const progressSegment = document.createElement('div');
        progressSegment.classList.add('progress-segment');
        progressSegment.dataset.index = i;

        // Добавляем обработчик клика для сегмента
        progressSegment.addEventListener('click', function() {
            clearInterval(sliderInterval); // Останавливаем автоматическое переключение
            goToSlide(i);
            startSlider(); // Перезапускаем автоматическое переключение, если необходимо
        });

        progressBar.appendChild(progressSegment);
    }

    const progressSegments = progressBar.querySelectorAll('.progress-segment');

    function showSlide(index) {
        // Скрываем все слайды
        sliderItems.forEach(item => {
            item.classList.add('hidden');
        });

        // Убираем активный класс у всех сегментов прогресс-бара
        progressSegments.forEach(segment => {
            segment.classList.remove('active');
            segment.style.width = '0%';
            segment.classList.remove('animate');
        });

        // Показываем текущий слайд
        sliderItems[index].classList.remove('hidden');

        // Активируем соответствующий сегмент прогресс-бара
        progressSegments[index].classList.add('active');
        progressSegments[index].classList.add('animate');
    }

    function goToSlide(index) {
        currentIndex = index;
        showSlide(currentIndex);
    }

    function nextSlide() {
        currentIndex = (currentIndex + 1) % totalItems;
        showSlide(currentIndex);
    }

    function startSlider() {
        sliderInterval = setInterval(() => {
            nextSlide();
        }, slideDuration);
    }

    // Инициализация слайдера
    showSlide(currentIndex);
    startSlider();

}