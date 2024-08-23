function addHtmlContainer() {
    const adContainer = document.createElement('div');
    adContainer.id = 'ssp-ad-container';

    adContainer.innerHTML = `
    <div class="ssp-ads-box">
        <div id="ssp-banner-container" class="ssp-banner-container"></div>
    </div>
    
    <div class="ssp-btn-box">
        <div class="ssp-opacity"></div>
        <div class="ssp-content">
            <div class="ssp-text">Подтвердите, что вам исполнилось 18 лет</div>
            <div class="ssp-btn ssp-btn--ok">Подтверждаю</div>
            <div class="ssp-btn ssp-btn--err">Не подтверждаю</div>
        </div>
    </div>
    `;

    document.body.appendChild(adContainer);
}

function applyStyles() {
    const css = `
    
        #ssp-banner-container {
            height: 100%;
        }
        
        #ssp-ad-container {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 9999;
        }
        
        .ssp-ads-box {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 1;
            background-color: rgba(0, 0, 0, 0.5); /* Прозрачный фон */
        }
        
        .ssp-btn-box {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 2;
            display: flex;
            justify-content: center;
            align-items: center;
            pointer-events: none;
            touch-action: none;
        }
        
        .ssp-opacity {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.9); /* Прозрачный фон */
        }
        
        .ssp-content {
            position: relative;
            z-index: 1;
            text-align: center;
            color: #fff;
        }
        
        .ssp-btn {
            display: inline-block;
            padding: 10px 20px;
            margin: 10px;
            border: 2px solid #fff;
            border-radius: 5px;
            cursor: pointer;
        }
        
        .ssp-btn:hover {
            background-color: rgba(255, 255, 255, 0.2);
        }
        
        .ssp-btn--ok {
            color: #fff;
            background-color: green;
        }
        
        .ssp-btn--err {
            color: #fff;
            background-color: red;
        }
    `;


    const style = document.createElement('style');
    style.type = 'text/css';
    style.appendChild(document.createTextNode(css)); // Для остальных браузеров

    document.head.appendChild(style);
}

function getAdIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('adm_id');
}

async function fetchAdContent(adId) {
    if (adId === "17") {
        return fetchAdContentFromFake(adId)
    }

    return fetchAdContentFromSSP(adId)
}

async function fetchAdContentFromSSP(adId) {
    const response = await fetch(`https://bid.sspnet.tech/rtb/adm/${adId}`);
    return await response.json();
}

async function fetchAdContentFromFake(adId) {
    const response = await fetch(`https://fake.sspnet.pro/public/api/v1/creative/${adId}`);
    const data = await response.json();

    if (data.err.id === 0) {
        return data.adm;
    } else {
        throw new Error('Не удалось получить контент рекламы');
    }
}

document.addEventListener('DOMContentLoaded', async () => {

    const adId = getAdIdFromUrl();
    if (!adId) {
        console.error('ID рекламы отсутствует в URL');
        return;
    }

    addHtmlContainer();
    applyStyles();

    try {
        const adContent = await fetchAdContent(adId);

        // Создаем Blob с HTML-содержимым
        const blob = new Blob([adContent], { type: 'text/html' });
        const blobURL = URL.createObjectURL(blob);

        // Создаем iframe с атрибутом srcdoc
        const iframe = document.createElement('iframe');
        iframe.src = blobURL; // Используем свойство srcdoc
        iframe.width = "100%"; // Задайте нужные размеры
        iframe.height = "100%"; // Задайте нужные размеры
        iframe.style.border = "none"; // Убираем рамку

        // Добавление контента рекламы в banner-container
        const bannerContainer = document.getElementById('ssp-banner-container');
        // Добавляем iframe в контейнер
        bannerContainer.appendChild(iframe);

        // document.querySelector('.ssp-ads-box > div').style.transform = `scale(${window.innerWidth / 400},${window.innerHeight / 700})`;
        document.querySelector('.ssp-ads-box > div > iframe').style.transform = `scale(${window.innerWidth / 400},${window.innerHeight / 700})`;

    } catch (error) {
        console.error('Ошибка при получении и отображении рекламы:', error);
    }
});
