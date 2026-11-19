
const imageInput = document.getElementById("imageInput");
const uploadButton = document.getElementById("uploadButton");
const uploadedImage = document.getElementById("uploadedImage");

const startButton = document.getElementById("startButton");
const stopButton = document.getElementById("stopButton");

const videoInput = document.getElementById("videoInput");
const recordedVideo = document.getElementById("recordedVideo");
const downloadLink = document.getElementById("downloadLink");

const status = document.getElementById("status");

let imageURL = null;
let videoURL = null;

// 사진 업로드
uploadButton.addEventListener("click", () => {
    imageInput.click();
});

imageInput.addEventListener("change", () => {
    const file = imageInput.files[0];

    if (!file) return;

    if (imageURL) {
        URL.revokeObjectURL(imageURL);
    }

    imageURL = URL.createObjectURL(file);

    uploadedImage.src = imageURL;
    uploadedImage.style.display = "block";
});

// 아이폰 후면 카메라 실행
startButton.addEventListener("click", () => {

    const input = document.createElement("input");

    input.type = "file";
    input.accept = "video/*";
    input.setAttribute("capture", "environment");

    input.addEventListener("change", () => {
        const file = input.files[0];

        if (!file) {
            status.textContent = "촬영이 취소되었습니다.";
            return;
        }

        displayVideo(file);
    });

    input.click();

});

// 촬영 중지 버튼
stopButton.addEventListener("click", () => {
    status.textContent =
        "기본 카메라 앱에서 촬영을 종료해 주세요.";

    startButton.disabled = false;
    stopButton.disabled = true;
});

// 영상 파일 가져오기
videoInput.addEventListener("change", () => {
    const file = videoInput.files[0];

    if (!file) return;

    displayVideo(file);
});

// 영상 표시 및 다운로드
function displayVideo(file) {

    if (videoURL) {
        URL.revokeObjectURL(videoURL);
    }

    videoURL = URL.createObjectURL(file);

    recordedVideo.src = videoURL;
    recordedVideo.hidden = false;

    downloadLink.href = videoURL;
    downloadLink.download = "recording.mov";
    downloadLink.hidden = false;

    status.textContent = "영상이 등록되었습니다.";

    startButton.disabled = false;
    stopButton.disabled = true;
}
