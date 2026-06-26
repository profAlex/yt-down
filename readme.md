    1. Установи Node.js и npm:

    sudo apt update
    sudo apt install nodejs npm

    2. Скачай или скопируй свою папку с кодом в любое место на новой системе и зайди в неё через терминал:

    cd /путь/к/твоей/папке/с/кодом

    3. Восстанови зависимости и активируй команду:

    npm install      # Скачает все библиотеки (youtube-dl-exec, ffmpeg и т.д.)
    npm run build    # Скомпилирует TypeScript в JavaScript
    sudo npm link    # Снова пропишет команду yt-down в систему
    
    4. Запусти приложение из терминала:
    
    yt-down
