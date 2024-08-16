function addHtmlContainer() {
    const adContainer = document.createElement('div');
    adContainer.id = 'ad-container';

    adContainer.innerHTML = `
    <div class="ads-box">
        <div id="video-container" class="video-container"></div>
    </div>
    
    <div class="btn-box">
        <div class="opacity"></div>
        <div class="content">
            <div class="text">Подтвердите, что вам исполнилось 18 лет</div>
            <div class="btn btn--ok">Подтверждаю</div>
            <div class="btn btn--err">Не подтверждаю</div>
        </div>
    </div>
    `;

    document.body.appendChild(adContainer);
}

function removeHtmlContainer() {
    const adContainer = document.getElementById('ad-container');
    if (adContainer) {
        adContainer.remove();
    }
}

function loadScript(src) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.async = true;

        script.onload = () => {
            console.log(`${src} загружен`);
            resolve();
        };
        script.onerror = () => {
            console.error(`Ошибка при загрузке скрипта: ${src}`);
            reject(new Error(`Ошибка загрузки скрипта: ${src}`));
        };

        document.head.appendChild(script);
    });
}

function applyStyles() {
    const css2 = `
        body {
            border: 0;
            margin: 0;
            padding: 0;
            width: 100vw;
            height: 100vh;
            overflow: hidden;
            background: #000;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .ads-box,
        .video-container {
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        
        #ad-content {
            position: fixed;
            left: 0;
            top: 0;
            width: 100%;
            height: 100vh;
        }
        .btn-box {
            position: fixed;
            pointer-events: none;
            left: 0;
            top: 0;
            width: 100%;
            height: 100vh;
        }
        .btn-box .opacity {
            opacity: 0.9;
            background-color: #000;
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100vh;
        }
        .btn-box .content {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            color: #fff;
            font-size: 40px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
        }
        .btn-box .btn {
            padding: 8px 14px;
            border-radius: 8px;
        }
        .btn.btn--ok {
            background-color: #29850b;
            margin: 40px auto;
        }
        .btn.btn--err {
            background-color: #834a4a;
        }
        .btn-box .text {
            text-align: center;
            font-size: 46px;
        }
        
        #ad-container {
            z-index: 99999
        }
    `;

    const css = `
        #ad-container {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 9999;
        }
        
        .ads-box {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 1;
            background-color: rgba(0, 0, 0, 0.5); /* Прозрачный фон */
        }
        
        .btn-box {
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
        
        .opacity {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.9); /* Прозрачный фон */
        }
        
        .content {
            position: relative;
            z-index: 1;
            text-align: center;
            color: #fff;
        }
        
        .btn {
            display: inline-block;
            padding: 10px 20px;
            margin: 10px;
            border: 2px solid #fff;
            border-radius: 5px;
            cursor: pointer;
        }
        
        .btn:hover {
            background-color: rgba(255, 255, 255, 0.2);
        }
        
        .btn--ok {
            background-color: green;
        }
        
        .btn--err {
            background-color: red;
        }

        .videoAdUiLearnMore {
            width: 100%;
            height: 100vh;
        }
    `;


    const style = document.createElement('style');
    style.type = 'text/css';
    style.appendChild(document.createTextNode(css)); // Для остальных браузеров

    document.head.appendChild(style);
}

function getAdIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}

async function fetchAdContent(adId) {
    const response = await fetch(`https://fake.sspnet.pro/public/api/v1/creative/${adId}`);
    const data = await response.json();

    if (data.err.id === 0) {
        return data.adm;
    } else {
        throw new Error('Не удалось получить контент рекламы');
    }
}

document.addEventListener('DOMContentLoaded', async () => {

    await loadScript("https://imasdk.googleapis.com/js/sdkloader/ima3.js"); // Загружаем IMA SDK

    const adId = getAdIdFromUrl();
    if (!adId) {
        console.error('ID рекламы отсутствует в URL');
        return;
    }

    addHtmlContainer();
    applyStyles();

    google.ima.settings.setVpaidMode(google.ima.ImaSdkSettings.VpaidMode.INSECURE);

    const video = document.createElement('video');
    const adContainer = document.getElementById('video-container');
    const containerWidth = window.innerWidth;
    const containerHeight = window.innerHeight;

    let adsManager;

    let startVideo = function () { };
    let setPlaybackRate = function () { };
    let pauseVideo = function () { };
    let resumeVideo = function () { };
    let setVolume = function () { };


    const onAdError = (adErrorEvent) => {
        console.error(adErrorEvent);
    };

    const onAdLoaded = () => {
        startVideo = () =>  adsManager.start();
        startVideo()
    };

    const onAdStarted = (event) => {
        setPlaybackRate = function (rate) {
            adContainer.querySelector('video').playbackRate = rate;
        };

        pauseVideo = () => adsManager.pause();
        resumeVideo = () => adsManager.resume();
        setVolume = (volume) => adsManager.setVolume(volume);
    };

    const onAdComplete = () => {
        removeHtmlContainer()
    };

    const onAdClick = () => {
        setPlaybackRate(10)
    };

    const onProgress = (event) => {
    };

    const onAdsManagerLoaded = (adsManagerLoadedEvent) => {
        const adsRenderingSettings = new google.ima.AdsRenderingSettings();
        adsRenderingSettings.enablePreloading = true;
        adsRenderingSettings.uiElements = [];

        adsManager = adsManagerLoadedEvent.getAdsManager(video, adsRenderingSettings);
        adsManager.setVolume(0); // Установить громкость на 0

        // https://developers.google.com/interactive-media-ads/docs/sdks/html5/client-side/reference/js/google.ima.AdEvent
        adsManager.addEventListener(google.ima.AdErrorEvent.Type.AD_ERROR, onAdError);
        adsManager.addEventListener(google.ima.AdEvent.Type.LOADED, onAdLoaded);
        adsManager.addEventListener(google.ima.AdEvent.Type.STARTED, onAdStarted);
        adsManager.addEventListener(google.ima.AdEvent.Type.COMPLETE, onAdComplete);
        adsManager.addEventListener(google.ima.AdEvent.Type.AD_PROGRESS, onProgress);
        adsManager.addEventListener(google.ima.AdEvent.Type.CLICK, onAdClick);

        adsManager.init(containerWidth, containerHeight, google.ima.ViewMode.NORMAL);
    };

    const adDisplayContainer = new google.ima.AdDisplayContainer(adContainer);
    adDisplayContainer.initialize();

    const adsLoader = new google.ima.AdsLoader(adDisplayContainer);
    adsLoader.addEventListener(google.ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED, onAdsManagerLoaded);
    adsLoader.addEventListener(google.ima.AdErrorEvent.Type.AD_ERROR, onAdError);

    try {
        const adContent = await fetchAdContent(adId);

        const adsRequest = new google.ima.AdsRequest();
        adsRequest.adsResponse = adContent;
        adsLoader.requestAds(adsRequest);

        // document.querySelector('.ads-box > div').style.transform = `scale(${window.innerWidth / 400},${window.innerHeight / 700})`;

    } catch (error) {
        console.error('Ошибка при получении и отображении рекламы:', error);
    }
});
