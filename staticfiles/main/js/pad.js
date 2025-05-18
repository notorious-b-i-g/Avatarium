//window.Telegram.WebApp.ready();

if (window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.initDataUnsafe) {
    window.Telegram.WebApp.ready(function() {
        const user = window.Telegram.WebApp.initDataUnsafe.user;
        if (user) {
            const userId = user.id;
            const username = user.username || '';
            const queryString = `username=${encodeURIComponent(usernameParam)}&usertelegramname=${encodeURIComponent(usertelegramnameParam)}`;
            const targetUrl = `/check_profile/?${queryString}`;

            // �������������� ������������ �� URL
            window.location.href = targetUrl;


        } else {
            alert('���������� � ������������ ����������.');
        }
    });
} else {
    alert('�������� ����� Telegram.');
}










