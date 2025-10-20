// 1. Canvas ve HTML Elementlerini Ayarla
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const progressBar = document.getElementById('progress-bar');
const progressText = document.getElementById('progress-text');
const gameContainer = document.getElementById('game-container');
const finalScreen = document.getElementById('final-gift-screen');

// 2. Resimleri Yükle
const playerImage = new Image();
playerImage.src = 'player.jpg.jpg'; // Oyuncu fotoğrafı

const goodCode = new Image();
goodCode.src = 'code.png'; // İyi şey (kod)

const goodGift = new Image();
goodGift.src = 'gift.png'; // İyi şey (hediye)

const badBug = new Image();
badBug.src = 'bug.png'; // Kötü şey (bug)

const goodItems = [goodCode, goodGift];

// 3. Oyun Değişkenleri
let player = {
    x: canvas.width / 2 - 25,
    y: canvas.height - 70, // Ekranın altında
    width: 50,
    height: 50,
    speed: 10 // Hareket hızı
};

let items = []; // Düşen objelerin dizisi
let compileProgress = 0; // 0'dan 100'e giden derleme yüzdesi
let gameLoopId; // Oyunu durdurmak için

// 4. Oyuncu Kontrolleri (Sadece Sol/Sağ Ok Tuşları)
let keys = {};
document.addEventListener('keydown', function(e) {
    keys[e.code] = true;
});
document.addEventListener('keyup', function(e) {
    keys[e.code] = false;
});

function movePlayer() {
    if (keys['ArrowLeft'] && player.x > 0) {
        player.x -= player.speed;
    }
    if (keys['ArrowRight'] && player.x < canvas.width - player.width) {
        player.x += player.speed;
    }
}

// 5. Objeleri Oluşturma
function generateItem() {
    let item = {};
    item.x = Math.random() * (canvas.width - 30); // Rastgele X konumu
    item.y = -30; // Ekranın üstünden başla
    item.width = 30;
    item.height = 30;
    item.speed = Math.random() * 2 + 2; // Rastgele hız

    // %70 ihtimalle iyi, %30 ihtimalle kötü obje çıksın
    if (Math.random() < 0.7) {
        item.isGood = true;
        item.image = goodItems[Math.floor(Math.random() * goodItems.length)]; // Kod veya Hediye
    } else {
        item.isGood = false;
        item.image = badBug; // Bug
    }
    items.push(item);
}

// 6. Çarpışma Kontrolü
function checkCollision(item) {
    return (
        player.x < item.x + item.width &&
        player.x + player.width > item.x &&
        player.y < item.y + item.height &&
        player.y + player.height > item.y
    );
}

// 7. Yükleme Çubuğunu Güncelle
function updateProgress() {
    // Yüzde 0'ın altına inmesin
    if (compileProgress < 0) compileProgress = 0;
    
    progressBar.style.width = compileProgress + '%';
    progressText.textContent = `Compiling... ${Math.round(compileProgress)}%`;

    // DERLEME TAMAMLANDI!
    if (compileProgress >= 100) {
        showFinalGift();
    }
}

// 8. FİNAL HEDİYE EKRANI
function showFinalGift() {
    cancelAnimationFrame(gameLoopId); // Oyunu durdur
    gameContainer.style.display = 'none'; // Oyunu gizle
    finalScreen.style.display = 'flex'; // Hediye ekranını göster
}

// 9. ANA OYUN DÖNGÜSÜ
let frame = 0;
function gameLoop() {
    // Ekranı temizle
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Oyuncuyu hareket ettir ve çiz
    movePlayer();
    ctx.drawImage(playerImage, player.x, player.y, player.width, player.height);

    // Belli aralıklarla yeni obje oluştur
    if (frame % 40 === 0) { // 40 karede bir
        generateItem();
    }

    // Tüm objeleri hareket ettir, çiz ve kontrol et
    for (let i = items.length - 1; i >= 0; i--) {
        let item = items[i];
        item.y += item.speed;

        // Ekrana çiz
        ctx.drawImage(item.image, item.x, item.y, item.width, item.height);

        // Çarpışmayı kontrol et
        if (checkCollision(item)) {
            if (item.isGood) {
                compileProgress += 5; // İyi ise yüzdeyi artır
            } else {
                compileProgress -= 10; // Kötü ise yüzdeyi düşür
            }
            updateProgress();
            items.splice(i, 1); // Çarpan objeyi sil
        }

        // Ekranın altından çıkan objeyi sil
        if (item.y > canvas.height) {
            items.splice(i, 1);
        }
    }

    frame++;
    gameLoopId = requestAnimationFrame(gameLoop); // Döngüyü tekrarla
}


// Oyunu Başlat
// Tüm resimler yüklendikten sonra oyunu başlatmak en doğrusudur.
let imagesLoaded = 0;
const totalImages = 4;
function onImageLoad() {
    imagesLoaded++;
    if (imagesLoaded === totalImages) {
        gameLoop(); // Tüm 4 resim de yüklendi, oyunu başlat!
    }
} // <-- FONKSİYONUN KAPATMA PARANTEZİ BURADA OLMALI

// Bu komutlar fonksiyonun DIŞINDA olmalı ki çalışsınlar
playerImage.onload = onImageLoad;
goodCode.onload = onImageLoad;
goodGift.onload = onImageLoad;
badBug.onload = onImageLoad;