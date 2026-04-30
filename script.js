const panels = document.querySelectorAll(".panel");
const progress = document.querySelector(".progress");
const scripts = document.querySelectorAll(".script-item");
const horizontal = document.querySelector(".horizontal");

let index = 0;
let isScrolling = false;

function updateScript() {
    scripts.forEach((el) => el.classList.remove("active"));
    scripts[index].classList.add("active");
}

// 🔥 핵심: wheel 안정화
window.addEventListener("wheel", (e) => {
    if (isScrolling) return;

    // 🔥 스크롤 방향 (트랙패드/마우스 안정 처리)
    const direction = Math.sign(e.deltaY);

    if (direction === 0) return;

    isScrolling = true;

    // 🔥 index 변경
    index += direction;

    // 🔥 범위 제한
    index = Math.max(0, Math.min(index, panels.length - 1));

    // 🔥 이동
    horizontal.style.transform =
        `translateX(-${index * 100}vw)`;

    // 🔥 프로그레스
    const percent = (index / (panels.length - 1)) * 100;
    progress.style.width = `${percent * 100}% / 100%`;

    // 🔥 대본 업데이트 (여기서 바로 해도 안전)
    updateScript();

    // 🔥 scroll lock 해제 (transition 기준)
    setTimeout(() => {
        isScrolling = false;
    }, 700);
});

// 🔥 대본 토글
const btn = document.getElementById("scriptToggle");
const box = document.getElementById("scriptBox");

btn.addEventListener("click", () => {
    box.style.display = box.style.display === "block" ? "none" : "block";
});