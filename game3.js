let isButtonSoundOn = true; // Biến lưu trạng thái bật/tắt âm thanh của nút
let isBackgroundMusicOn = true; // Biến lưu trạng thái bật/tắt nhạc nền
const bgMusic = document.getElementById("background-music"); // Đối tượng nhạc nền
const buttonSound = document.getElementById("button-sound"); // Đối tượng âm thanh của nút
const correctSound = document.getElementById("correct-sound"); // Đối tượng âm thanh cho câu trả lời đúng
const incorrectSound = document.getElementById("incorrect-sound"); // Đối tượng âm thanh cho câu trả lời sai

// Khi trang tải xong, thiết lập và phát nhạc nền
window.onload = function () {
    bgMusic.volume = 0.5; // Đặt âm lượng nhạc nền (0.5 là mức trung bình)
    bgMusic.play(); // Phát nhạc nền ngay khi trang tải
};

function startbutton() {
    if (isButtonSoundOn) {
        buttonSound.currentTime = 0; // Đặt lại âm thanh nút về đầu
        buttonSound.play(); // Phát âm thanh của nút
    }
    window.location.href = "level1.html"; // Chuyển sang trang level1.html
}

function toggleButtonSound() {
    isButtonSoundOn = !isButtonSoundOn; // Đổi trạng thái âm thanh nút
    const buttonSoundOn = document.getElementById("toggle-button-sound-on"); // Biểu tượng bật âm thanh nút
    const buttonSoundOff = document.getElementById("toggle-button-sound-off"); // Biểu tượng tắt âm thanh nút
    
    buttonSoundOn.style.display = isButtonSoundOn ? "block" : "none";
    buttonSoundOff.style.display = isButtonSoundOn ? "none" : "block";

    if (!isButtonSoundOn) {
        buttonSound.pause();
        correctSound.pause();
        incorrectSound.pause();
    }
}

function toggleBackgroundMusic() {
    isBackgroundMusicOn = !isBackgroundMusicOn; // Đổi trạng thái nhạc nền
    if (isBackgroundMusicOn) {
        bgMusic.play(); // Phát nhạc nếu bật
    } else {
        bgMusic.pause(); // Dừng nhạc nếu tắt
    }
    const backgroundMusicOn = document.getElementById("toggle-background-music-on"); // Biểu tượng bật nhạc nền
    const backgroundMusicOff = document.getElementById("toggle-background-music-off"); // Biểu tượng tắt nhạc nền
    backgroundMusicOn.style.display = isBackgroundMusicOn ? "block" : "none";
    backgroundMusicOff.style.display = isBackgroundMusicOn ? "none" : "block";
}

let dragged; // Biến lưu mục rác đang được kéo
let dropObject;
var level1 = 7;
var FinalLevel; // Biến lưu cấp độ cuối cùng
var score = 0; // Biến lưu điểm
var totalGarbageThing = 0; // Tổng số mục rác cần thu thập
let startTime; // Thời gian bắt đầu trò chơi

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
        target.style.backgroundColor = ''; // Xóa màu nền vùng thả
        event.preventDefault();
        dragged.parentNode.removeChild(dragged); // Xóa mục rác khỏi vị trí ban đầu
        dragged.style.opacity = ''; // Đặt lại độ trong suốt của mục
        totalGarbageThing--; // Giảm số lượng mục rác chưa thu thập
    }
    document.getElementById("Score").innerHTML = score; // Cập nhật điểm trên giao diện

    checkAllTrashCollected(); // Gọi hàm kiểm tra sau khi thả rác
}

function onDragStart(event) {
    if (document.getElementById("flag").value == "true") { // Kiểm tra nếu trò chơi đã bắt đầu
        let target = event.target;
        if (target && target.nodeName === 'IMG') {
            dragged = target; // Lưu mục đang kéo
            event.dataTransfer.setData('text', target.id); // Lưu ID mục rác
            event.dataTransfer.dropEffect = 'move'; // Đặt hiệu ứng thả là 'move'
            event.target.style.opacity = .3; // Giảm độ trong suốt
        }
    }
}

function onDragEnd(event) {
    if (event.target && event.target.nodeName === 'IMG') {
        event.target.style.opacity = ''; 
        dragged = null; // Đặt lại mục đang kéo
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

// Đếm ngược và thiết lập thời gian bắt đầu
function countdown(level) {
    FinalLevel = level;
    document.getElementById("flag").value = "true"; // Đặt cờ để bắt đầu trò chơi
    document.getElementById("startBtn").disabled = true;
    startTime = Date.now(); // Ghi nhận thời gian bắt đầu

    function updateCounter() {
        let elapsedTime = Math.floor((Date.now() - startTime) / 1000);
        document.getElementById('counter').innerHTML = "Đã chơi: " + elapsedTime + "s";

        requestAnimationFrame(updateCounter); // Cập nhật bộ đếm liên tục
    }

    requestAnimationFrame(updateCounter);
}

function saveGameState() {
    localStorage.setItem('score', score.toString());
    localStorage.setItem('level', FinalLevel);
}

function endGame() {
    saveGameState();
    alert("Trò chơi kết thúc! Điểm của bạn là: " + score);
}

function restoreGameState() {
    const savedScore = localStorage.getItem('score');
    const savedLevel = localStorage.getItem('level');
    if (savedScore !== null) {
        score = parseInt(savedScore, 10);
        document.getElementById("Score").innerHTML = score;
    }
    if (savedLevel !== null) {
        FinalLevel = savedLevel;
    }
}

document.addEventListener('DOMContentLoaded', restoreGameState);

// Kiểm tra nếu tất cả mục rác đã được thu thập
function checkAllTrashCollected() {
    if (totalGarbageThing === 0) {
        let elapsedTime = Math.floor((Date.now() - startTime) / 1000);

        if (elapsedTime < 30) {
            score += 10; // Bonus for finishing within 30 seconds
        } else if (elapsedTime < 60) {
            score += 5; // Bonus for finishing within 60 seconds
        }

        document.getElementById("Score").innerHTML = score;

        // Accumulate and save total score in localStorage
        let totalScore = parseInt(localStorage.getItem("totalScore")) || 0;
        totalScore += score;
        localStorage.setItem("totalScore", totalScore);

        // Determine the current level and navigate
        const currentLevel = parseInt(window.location.href.match(/level(\d+)\.html/)[1]);

        if (currentLevel === 3) {
            window.location.href = "victory.html"; // Go to victory page after level 3
        } else {
            const nextLevel = currentLevel + 1;
            window.location.href = `level${nextLevel}.html`; // Move to the next level
        }
    }
}

