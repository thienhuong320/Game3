// Biến lưu trạng thái bật/tắt âm thanh của nút và nhạc nền
let isButtonSoundOn = true; // Biến lưu trạng thái bật/tắt âm thanh của nút
let isBackgroundMusicOn = true; // Biến lưu trạng thái bật/tắt nhạc nền

// Các đối tượng âm thanh từ file audio
const bgMusic = document.getElementById("background-music"); // Đối tượng nhạc nền
const buttonSound = document.getElementById("button-sound"); // Đối tượng âm thanh của nút
const correctSound = document.getElementById("correct-sound"); // Đối tượng âm thanh cho câu trả lời đúng
const incorrectSound = document.getElementById("incorrect-sound"); // Đối tượng âm thanh cho câu trả lời sai

// Khi trang tải xong, thiết lập và phát nhạc nền
window.onload = function () {
    bgMusic.volume = 0.5;
    bgMusic.play();
};

// Hàm xử lý sự kiện khi nhấn nút "Start"
function startbutton() {
   
    // Đặt điểm và thời gian ban đầu khi vào level 1
    if (window.location.href.includes("level1")) {
        localStorage.setItem("score", "0");
        localStorage.setItem("elapsedTime", "0");
    }

    setTimeout(() => {
        window.location.href = "level1.html";
    }, 300);
}

// Hàm bật/tắt âm thanh của nút
function toggleButtonSound() {
    isButtonSoundOn = !isButtonSoundOn;
    const buttonSoundOn = document.getElementById("toggle-button-sound-on");
    const buttonSoundOff = document.getElementById("toggle-button-sound-off");

    buttonSoundOn.style.display = isButtonSoundOn ? "block" : "none";
    buttonSoundOff.style.display = isButtonSoundOn ? "none" : "block";

    if (!isButtonSoundOn) {
        buttonSound.pause();
        correctSound.pause();
        incorrectSound.pause();
    }
}

// Hàm bật/tắt nhạc nền
function toggleBackgroundMusic() {
    isBackgroundMusicOn = !isBackgroundMusicOn;
    if (isBackgroundMusicOn) {
        bgMusic.play();
    } else {
        bgMusic.pause();
    }
    
    const backgroundMusicOn = document.getElementById("toggle-background-music-on");
    const backgroundMusicOff = document.getElementById("toggle-background-music-off");

    backgroundMusicOn.style.display = isBackgroundMusicOn ? "block" : "none";
    backgroundMusicOff.style.display = isBackgroundMusicOn ? "none" : "block";
}

// Các biến lưu thông tin về trò chơi
let dragged;
let totalGarbageThing = 0;
let score = 0;
let startTime;

// Các hàm xử lý sự kiện khi kéo và thả các mục rác
function onDragOver(event) {
    event.preventDefault();
}

function onDragLeave(event) {
    event.target.style.background = '';
}

function onDragEnter(event) {
    const target = event.target;
    if (target && dragged) {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }
}

function onDrop(event) {
    const target = event.target;
    var scoreCnt = 0;
    var garbageType = dragged.getAttribute("data-garbageType");
    var dustbinType = target.getAttribute("data-dustbinType");

    if (garbageType === dustbinType) {
        scoreCnt++;
    } else {
        scoreCnt--;
    }
    score += scoreCnt;

    if (target && dragged) {
        target.style.backgroundColor = '';
        event.preventDefault();
        dragged.parentNode.removeChild(dragged);
        dragged.style.opacity = '';
        totalGarbageThing--;
    }

    document.getElementById("Score").innerHTML = score;

    checkAllTrashCollected();
}

function onDragStart(event) {
    if (document.getElementById("flag").value == "true") {
        let target = event.target;
        if (target && target.nodeName === 'IMG') {
            dragged = target;
            event.dataTransfer.setData('text', target.id);
            event.dataTransfer.dropEffect = 'move';
            event.target.style.opacity = .3;
        }
    }
}

function onDragEnd(event) {
    if (event.target && event.target.nodeName === 'IMG') {
        event.target.style.opacity = ''; 
        dragged = null;
    }
}

const totalTrash = document.getElementsByClassName("trash");
totalGarbageThing = totalTrash.length;
for (let i = 0; i < totalTrash.length; i++) {
    totalTrash[i].addEventListener('dragstart', onDragStart);
    totalTrash[i].addEventListener('dragend', onDragEnd);
}

const dropZones = document.querySelectorAll('[data-dustbinType]');
dropZones.forEach(dropZone => {
    dropZone.addEventListener('drop', onDrop);
    dropZone.addEventListener('dragenter', onDragEnter);
    dropZone.addEventListener('dragleave', onDragLeave);
    dropZone.addEventListener('dragover', onDragOver);
});

// Đếm ngược thời gian và bắt đầu trò chơi
function countdown(level) {
    document.getElementById("flag").value = "true";
    document.getElementById("startBtn").disabled = true;
    startTime = Date.now();

    function updateCounter() {
        let elapsedTime = Math.floor((Date.now() - startTime) / 1000);
        document.getElementById('counter').innerHTML = "Đã chơi: " + elapsedTime + "s";
        requestAnimationFrame(updateCounter);
    }

    requestAnimationFrame(updateCounter);
}

function checkAllTrashCollected() {
    if (totalGarbageThing === 0) {
        let elapsedTime = Math.floor((Date.now() - startTime) / 1000);
        let bonusPoints = 0;

        if (elapsedTime < 30) {
            bonusPoints = 10;
        } else if (elapsedTime < 60) {
            bonusPoints = 5;
        }

        score += bonusPoints; // Cộng điểm từ cấp độ hiện tại

        // Lấy tổng điểm từ localStorage và cộng thêm điểm của cấp độ hiện tại
        let totalScore = parseInt(localStorage.getItem("totalScore")) || 0;
        totalScore += score;

        // Lưu lại điểm và thời gian vào localStorage
        localStorage.setItem("score", score);
        localStorage.setItem("totalScore", totalScore); // Cập nhật điểm tổng cộng
        localStorage.setItem("elapsedTime", elapsedTime);

        alert(`Cấp độ hoàn thành!\nThời gian: ${elapsedTime} giây\nĐiểm thưởng: ${bonusPoints}\nTổng điểm hiện tại: ${totalScore}`);

        const currentLevel = parseInt(window.location.href.match(/level(\d+)\.html/)[1]);
        
        // Chuyển sang cấp độ tiếp theo hoặc trang chiến thắng nếu hoàn thành cấp độ cuối
        if (currentLevel === 3) {
            window.location.href = "victory.html";
        } else {
            window.location.href = `level${currentLevel + 1}.html`;
        }
    }
}


// Cập nhật điểm và thời gian khi vào trang chiến thắng
function displayVictoryInfo() {
    const finalScore = localStorage.getItem("totalScore") || 0;
    const finalTime = localStorage.getItem("elapsedTime") || 0;

    document.getElementById("finalScore").textContent = finalScore;
    document.getElementById("finalTime").textContent = finalTime;
}

// Gọi displayVictoryInfo khi trang chiến thắng được tải
if (window.location.href.includes("victory")) {
    window.onload = displayVictoryInfo;
}
