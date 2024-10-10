import socket
import time
import socks  # Библиотека для проксификации

# Прокси-сервер SOCKS5
PROXY_IP = "178.255.222.74"
PROXY_PORT = 3128

# IP и порт целевого сервера
UDP_IP = "178.255.222.74"
UDP_PORT = 12345
MESSAGE = b"Test UDP message"

# Настройка прокси для использования с SOCKS5
sock = socks.socksocket(socket.AF_INET, socket.SOCK_DGRAM)
sock.set_proxy(socks.SOCKS5, PROXY_IP, PROXY_PORT)

# Цикл для отправки сообщений
while True:
    try:
        sock.sendto(MESSAGE, (UDP_IP, UDP_PORT))
        print(f"Sent message to {UDP_IP}:{UDP_PORT}")
    except Exception as e:
        print(f"Failed to send message: {e}")
    time.sleep(1)
