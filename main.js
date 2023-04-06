const container = document.querySelector(".container"),
  mainVideo = container.querySelector("video"),
  videoTimeline = container.querySelector(".video-timeline"),
  progressBar = container.querySelector(".progress-bar"),
  volumeBtn = container.querySelector(".volume i"),
  volumeSlider = container.querySelector(".left input"),
  currentVidTime = container.querySelector(".current-time"),
  videoDuration = container.querySelector(".video-duration"),
  skipBackward = container.querySelector(".skip-backward i"),
  skipForward = container.querySelector(".skip-forward i"),
  playPauseBtn = container.querySelector(".play-pause i"),
  speedBtn = container.querySelector(".playback-speed span"),
  speedOptions = container.querySelector(".speed-options"),
  pipBtn = container.querySelector(".pic-in-pic span"),
  fullScreenBtn = container.querySelector(".fullscreen i");
let timer;

const hideControls = () => {
  if (mainVideo.paused) return;
  timer = setTimeout(() => {
    container.classList.remove("show-controls");
  }, 3000);
};
hideControls();

container.addEventListener("mousemove", () => {
  container.classList.add("show-controls");
  clearTimeout(timer);
  hideControls();
});

const formatTime = (time) => {
  //  getting seconds, minutes, hours
  let seconds = Math.floor(time % 60),
    minutes = Math.floor(time / 60) % 60,
    hours = Math.floor(time / 3600);

  // adding 0 at the beginning if the particular value is less than 10
  seconds = seconds < 10 ? `0${seconds}` : seconds;
  minutes = minutes < 10 ? `0${minutes}` : minutes;
  hours = hours < 10 ? `0${hours}` : hours;

  if (hours == 0) {
    return `${minutes}:${seconds}`;
  }
  return `${hours}:${minutes}:${seconds}`;
};

mainVideo.addEventListener("timeupdate", (e) => {
  // getting currentTime & duration of video
  let { currentTime, duration } = e.target;
  // getting percent
  let percent = (currentTime / duration) * 100;
  // passing percent as progressbar width
  progressBar.style.width = `${percent}%`;
  currentVidTime.innerText = formatTime(currentTime);
});

mainVideo.addEventListener("loadeddata", () => {
  // passing video duration as videoDuration innertext
  videoDuration.innerText = formatTime(mainVideo.duration);
});

videoTimeline.addEventListener("click", (e) => {
  // getting videoTimeLine width
  let timelineWidth = videoTimeline.clientWidth;
  // updating video currentTime
  mainVideo.currentTime = (e.offsetX / timelineWidth) * mainVideo.duration;
});

const draggableProgressBar = (e) => {
  // getting videoTimeline width
  let timelineWidth = videoTimeline.clientWidth;
  // getting offset value as prograssbar width
  progressBar.style.width = `${e.offsetX}px`;
  // updating video currentTime

  mainVideo.currentTime = (e.offsetX / timelineWidth) * mainVideo.duration;
  currentVidTime.innerText = formatTime(mainVideo.currentTime);
};

videoTimeline.addEventListener("mousedown", () => {
  // calling draggableProgressBar function on mousemove event
  videoTimeline.addEventListener("mousemove", draggableProgressBar);
});

container.addEventListener("mouseup", () => {
  // remove mousemove listener on mousemove event
  videoTimeline.removeEventListener("mousemove", draggableProgressBar);
});

videoTimeline.addEventListener("mousemove", (e) => {
  const progressTime = videoTimeline.querySelector("span");
  let offsetX = e.offsetX;
  progressTime.style.left = `${offsetX}px`;
  // getting videoTimeline width
  let timelineWidth = videoTimeline.clientWidth;
  let percent = (e.offsetX / timelineWidth) * mainVideo.duration;
  progressTime.innerText = formatTime(percent);
});

volumeBtn.addEventListener("click", () => {
  // if volume icon isnt volume high icon
  if (!volumeBtn.classList.contains("fa-volume-high")) {
    // passing 0.5 value as video volume
    mainVideo.volume = 0.5;
    volumeBtn.classList.replace("fa-volume-xmark", "fa-volume-high");
  } else {
    // passing 0.0 value as video volume, so the video is mute
    mainVideo.volume = 0.0;
    volumeBtn.classList.replace("fa-volume-high", "fa-volume-xmark");
  }
  // update slider value according to the video volume
  volumeSlider.value = mainVideo.volume;
});

volumeSlider.addEventListener("input", (e) => {
  // passing slider value as video volume
  mainVideo.volume = e.target.value;

  // change volume icon to mute
  if (e.target.value == 0) {
    return volumeBtn.classList.replace("fa-volume-high", "fa-volume-xmark");
  } else {
    volumeBtn.classList.replace("fa-volume-xmark", "fa-volume-high");
  }
});

speedBtn.addEventListener("click", () => {
  // toggle show class
  speedOptions.classList.toggle("show");
});

speedOptions.querySelectorAll("li").forEach((option) => {
  // adding click event on all speed option
  option.addEventListener("click", () => {
    // passing option dataset value as video playback value
    mainVideo.playbackRate = option.dataset.speed;
    // removing active class
    speedOptions.querySelector(".active").classList.remove("active");
    // adding active class on the selected option
    option.classList.add("active");
  });
});

document.addEventListener("click", (e) => {
  // hide speed options on document click
  if (
    e.target.tagName !== "SPAN" ||
    e.target.className !== "material-symbols-rounded"
  ) {
    speedOptions.classList.remove("show");
  }
});

pipBtn.addEventListener("click", () => {
  // changing video mode to picture in picture
  mainVideo.requestPictureInPicture();
});

fullScreenBtn.addEventListener("click", () => {
  // toggle fullscreen class
  container.classList.toggle("fullscreen");
  // if video is already in fullscreen mode

  if (document.fullscreenElement) {
    fullScreenBtn.classList.replace("fa-compress", "fa-expand");
    // exit from fullscreen mode and return
    return document.exitFullscreen();
  }
  fullScreenBtn.classList.replace("fa-expand", "fa-compress");
  // go to fullscreen mode
  container.requestFullscreen();
});

skipBackward.addEventListener("click", (e) => {
  // subract 5 seconds from the current video time
  mainVideo.currentTime -= 5;
});

skipForward.addEventListener("click", (e) => {
  // add 5 seconds to the current video time
  mainVideo.currentTime += 5;
});

playPauseBtn.addEventListener("click", () => {
  // if video is paused, play the video else pause the video
  mainVideo.paused ? mainVideo.play() : mainVideo.pause();
});

// change play and pause btn
mainVideo.addEventListener("play", () => {
  // if video is play, change icon to pause
  playPauseBtn.classList.replace("fa-play", "fa-pause");
});

mainVideo.addEventListener("pause", () => {
  // if video is pause, change icon to play
  playPauseBtn.classList.replace("fa-pause", "fa-play");
});

// speedBtn.addEventListener("click", () => speedOptions.classList.toggle("show"));
// pipBtn.addEventListener("click", () => mainVideo.requestPictureInPicture());
// skipBackward.addEventListener("click", () => (mainVideo.currentTime -= 5));
// skipForward.addEventListener("click", () => (mainVideo.currentTime += 5));
// mainVideo.addEventListener("play", () =>
//   playPauseBtn.classList.replace("fa-play", "fa-pause")
// );
// mainVideo.addEventListener("pause", () =>
//   playPauseBtn.classList.replace("fa-pause", "fa-play")
// );
// playPauseBtn.addEventListener("click", () =>
//   mainVideo.paused ? mainVideo.play() : mainVideo.pause()
// );
// videoTimeline.addEventListener("mousedown", () =>
//   videoTimeline.addEventListener("mousemove", draggableProgressBar)
// );
// document.addEventListener("mouseup", () =>
//   videoTimeline.removeEventListener("mousemove", draggableProgressBar)
// );
