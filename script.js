
const imageInput = document.getElementById("imageInput");
const uploadButton = document.getElementById("uploadButton");
const uploadedImage = document.getElementById("uploadedImage");

const cameraPreview = document.getElementById("cameraPreview");
const startButton = document.getElementById("startButton");
const stopButton = document.getElementById("stopButton");
const downloadLink = document.getElementById("downloadLink");

let cameraStream = null;
let mediaRecorder = null;
let recordedChunks = [];

// 사진 업로드 버튼
uploadButton.addEventListener("click", () => {
    imageInput.click();
});

// 사진 선택
imageInput.addEventListener("change", () => {
    const file = imageInput.files[0];

    if (!file) return;

    const imageURL = URL.createObjectURL(file);

    uploadedImage.src = imageURL;
    uploadedImage.style.display = "block";
});

// 촬영 시작
startButton.addEventListener("click", async () => {
    try {
        if (!navigator.mediaDevices?.getUserMedia) {
            alert("이 브라우저에서는 카메라를 사용할 수 없습니다.");
            return;
        }

        cameraStream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true
        });

        cameraPreview.srcObject = cameraStream;

        recordedChunks = [];

        mediaRecorder = new MediaRecorder(cameraStream);

        mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
                recordedChunks.push(event.data);
            }
        };

        mediaRecorder.onstop = () => {
            const videoBlob = new Blob(recordedChunks, {
                type: mediaRecorder.mimeType
            });

            const videoURL = URL.createObjectURL(videoBlob);

            downloadLink.href = videoURL;
            downloadLink.download = "recording.webm";
            downloadLink.hidden = false;
            downloadLink.textContent = "영상 다운로드";

            cameraStream.getTracks().forEach(track => track.stop());
            cameraStream = null;
            cameraPreview.srcObject = null;
        };

        mediaRecorder.start();

        startButton.disabled = true;
        stopButton.disabled = false;

    } catch (error) {
        alert("카메라를 실행할 수 없습니다: " + error.message);
    }
});

// 촬영 중지
stopButton.addEventListener("click", () => {
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
        mediaRecorder.stop();
    }

    startButton.disabled = false;
    stopButton.disabled = true;
});
