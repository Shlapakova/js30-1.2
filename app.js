"strict"
fetch('songs.json')
    .then(response => response.json())
    .then(data => {
        const songs = data.songs;
        let currentSongIndex = 0;

        const audioPlayer = document.getElementById('audioPlayer');
        const coverImage = document.getElementById('coverImage');
        const songTitle = document.getElementById('songTitle');
        const songArtist = document.getElementById('songArtist');
        const playBtn = document.getElementById('playBtn');
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        const container = document.getElementById('container');
        const progressBar = document.getElementById('progress-bar');
        const currentTime = document.querySelector('.currentTime');
        const remainingTime = document.querySelector('.remainingTime');
        const volumeBar = document.getElementById('volume-bar');
        const volumeBtn = document.getElementById('volumeBtn');
        const volumeValue = document.getElementById('volumeValue');
        function loadSong(index) {
            const song = songs[index];
            audioPlayer.src = song.src;
            coverImage.src = song.img;
            songTitle.textContent = song.name;
            songArtist.textContent = song.artist;
            playBtn.src = "assets/svg/play.png";
            audioPlayer.load();
            audioPlayer.currentTime = 0;
            container.style.backgroundImage = `url(${song.img})`;
            audioPlayer.volume = 1;
            volumeBar.value = 100;
            volumeValue.style.display = 'none';
        }

        loadSong(currentSongIndex);

        function updateProgress() {
            const { currentTime: current, duration } = audioPlayer;
            const percentage = (current / duration) * 100 || 0;
            progressBar.value = percentage;

            currentTime.textContent = formatTime(current);

            const remaining = duration - current || 0;
            remainingTime.textContent = `${formatTime(remaining)}`;
        }

        function formatTime(seconds) {
            const minutes = Math.floor(seconds / 60);
            const secs = Math.floor(seconds % 60);
            return `${minutes}:${secs < 10 ? '0' + secs : secs}`;
        }

        function toggleScale() {
            coverImage.style.transform = 'scale(1.15)';
            coverImage.style.transition = 'transform 1s';
        }

        function toggleScaleBack() {
            coverImage.style.transform = 'scale(1)';
            coverImage.style.transition = 'transform 1s';
        }

        playBtn.addEventListener('click', () => {
            if (audioPlayer.paused) {
                audioPlayer.play();
                playBtn.src = "assets/svg/pause.png";
                toggleScale();
            } else {
                audioPlayer.pause();
                playBtn.src = "assets/svg/play.png";
                toggleScaleBack()
            }
        });

        prevBtn.addEventListener('click', () => {
            currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
            loadSong(currentSongIndex);
            audioPlayer.play();
            playBtn.src = "assets/svg/pause.png";
            toggleScale();
        });

        nextBtn.addEventListener('click', () => {
            currentSongIndex = (currentSongIndex + 1) % songs.length;
            loadSong(currentSongIndex);
            audioPlayer.play();
            playBtn.src = "assets/svg/pause.png";
            toggleScale();
        });

        audioPlayer.addEventListener('ended', () => {
            currentSongIndex = (currentSongIndex + 1) % songs.length;
            loadSong(currentSongIndex);
            audioPlayer.play();
            toggleScale();
        });

        audioPlayer.addEventListener('timeupdate', updateProgress);

        function volumeCheck() {
            volumeBar.classList.toggle('hide');
        }
        volumeBtn.addEventListener('click', volumeCheck);

        volumeBar.addEventListener('input', () => {
            const volume = volumeBar.value;
            audioPlayer.volume = volume / 100;
            volumeValue.textContent = volume;
            volumeValue.style.display = 'inline';
            const percentageOfVolume = (volume / volumeBar.max) * 100;
            volumeValue.style.left = `calc(${percentageOfVolume}px + (${200}px))`;
        });

        volumeBar.addEventListener('mouseup', () => {
                volumeValue.style.display = 'none';
        });

        progressBar.addEventListener('input', () => {
            const newTime = (progressBar.value / 100) * audioPlayer.duration;
            audioPlayer.currentTime = newTime;
        });
    });
