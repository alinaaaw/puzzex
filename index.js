const tutorial = document.getElementById("tutorial");

if (tutorial) {
    const title = tutorial.querySelector("[data-tutorial-title]");
    const description = tutorial.querySelector("[data-tutorial-description]");
    const stepLabel = tutorial.querySelector("[data-tutorial-step]");
    const feedback = tutorial.querySelector("[data-tutorial-feedback]");
    const actionButton = tutorial.querySelector("[data-tutorial-action]");
    const demoButton = tutorial.querySelector("[data-watch-demo]");
    const submitButton = tutorial.querySelector("[data-submit]");
    const practiceBadge = tutorial.querySelector(".practice-badge");
    const directionButtons = [...tutorial.querySelectorAll("[data-direction]")];
    const progressItems = [...tutorial.querySelectorAll("[data-progress]")];
    const moveTile = tutorial.querySelector("[data-move-tile]");
    const destination = tutorial.querySelector("[data-destination]");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    const copy = {
        1: {
            label: "Step 1 of 3",
            title: "Read the target",
            description: "Compare the target with the outlined center of the board. The first center square needs a red tile.",
            feedback: "The empty square marks where the next tile can slide.",
            action: "Start practice"
        },
        2: {
            label: "Step 2 of 3",
            title: "Move the red tile right",
            description: "The red tile is directly left of the empty square. Choose Right because the direction describes how the tile moves.",
            feedback: "Try the direction buttons or use your keyboard arrows.",
            action: "Show the move"
        },
        3: {
            label: "Step 3 of 3",
            title: "Submit the match",
            description: "The outlined center now matches the target. Submit it just as you would in the real game.",
            feedback: "Press Enter on your keyboard or use the button below.",
            action: "Submit match"
        },
        complete: {
            label: "Practice complete",
            title: "You solved it!",
            description: "You moved the tile—not the empty space—and completed the target pattern.",
            feedback: "You are ready for a full randomized board.",
            action: "Choose a mode"
        }
    };

    let currentStep = 1;
    let isMoving = false;
    let demoRun = 0;

    function wait(milliseconds) {
        return new Promise((resolve) => window.setTimeout(resolve, milliseconds));
    }

    function cancelDemo() {
        demoRun += 1;
        demoButton.disabled = false;
        demoButton.innerHTML = '<span aria-hidden="true">▶</span> Watch demo';
    }

    function updateTutorial(step) {
        currentStep = step;
        const content = copy[step];
        const numericStep = step === "complete" ? 4 : step;

        tutorial.dataset.step = String(step);
        stepLabel.textContent = content.label;
        title.textContent = content.title;
        description.textContent = content.description;
        feedback.textContent = content.feedback;
        actionButton.firstChild.textContent = `${content.action} `;
        practiceBadge.textContent = step === "complete" ? "Complete" : "Practice";

        progressItems.forEach((item) => {
            const itemStep = Number(item.dataset.progress);
            item.classList.toggle("is-active", itemStep === numericStep);
            item.classList.toggle("is-complete", itemStep < numericStep);
        });

        directionButtons.forEach((button) => {
            button.disabled = step !== 2;
        });
        submitButton.disabled = step !== 3;

        if (step === 2) {
            tutorial.focus({ preventScroll: true });
        }
    }

    function resetBoard() {
        isMoving = false;
        tutorial.classList.remove("is-solved", "is-shaking");
        moveTile.className = "tile-red move-tile";
        destination.className = "empty-tile goal-cell";
    }

    function resetTutorial(cancelPlayback = true) {
        if (cancelPlayback) {
            cancelDemo();
        } else {
            demoRun += 1;
        }
        resetBoard();
        updateTutorial(1);
    }

    async function makeCorrectMove(fromDemo = false) {
        if (currentStep !== 2 || isMoving) {
            return;
        }

        if (!fromDemo) {
            cancelDemo();
        }
        isMoving = true;
        feedback.textContent = "Correct—the red tile moves right into the empty square.";
        moveTile.classList.add("is-sliding-right");

        await wait(reduceMotion.matches ? 30 : 430);
        moveTile.className = "empty-tile";
        destination.className = "tile-red goal-cell is-filled";
        isMoving = false;
        updateTutorial(3);
    }

    function tryDirection(direction) {
        if (currentStep !== 2 || isMoving) {
            return;
        }

        if (direction === "right") {
            makeCorrectMove();
            return;
        }

        cancelDemo();
        tutorial.classList.remove("is-shaking");
        void tutorial.offsetWidth;
        tutorial.classList.add("is-shaking");
        feedback.textContent = "Almost. That would move a different tile—try Right →.";
        window.setTimeout(() => tutorial.classList.remove("is-shaking"), 360);
    }

    function submitMatch(fromDemo = false) {
        if (currentStep !== 3) {
            return;
        }
        if (!fromDemo) {
            cancelDemo();
        }
        updateTutorial("complete");
        tutorial.classList.add("is-solved");
    }

    async function watchDemo() {
        resetTutorial(false);
        const thisRun = demoRun;
        demoButton.disabled = true;
        demoButton.textContent = "Playing demo…";

        await wait(reduceMotion.matches ? 150 : 900);
        if (thisRun !== demoRun) return;
        updateTutorial(2);

        await wait(reduceMotion.matches ? 150 : 1200);
        if (thisRun !== demoRun) return;
        await makeCorrectMove(true);

        await wait(reduceMotion.matches ? 150 : 900);
        if (thisRun !== demoRun) return;
        submitMatch(true);
        demoButton.disabled = false;
        demoButton.innerHTML = '<span aria-hidden="true">↻</span> Replay guide';
    }

    actionButton.addEventListener("click", () => {
        if (currentStep === 1) {
            cancelDemo();
            updateTutorial(2);
        } else if (currentStep === 2) {
            makeCorrectMove();
        } else if (currentStep === 3) {
            submitMatch();
        } else {
            window.location.href = "choose.html";
        }
    });

    directionButtons.forEach((button) => {
        button.addEventListener("click", () => tryDirection(button.dataset.direction));
    });

    submitButton.addEventListener("click", () => submitMatch());
    demoButton.addEventListener("click", watchDemo);

    tutorial.addEventListener("keydown", (event) => {
        const direction = event.key.startsWith("Arrow")
            ? event.key.replace("Arrow", "").toLowerCase()
            : null;

        if (currentStep === 2 && direction) {
            event.preventDefault();
            tryDirection(direction);
        } else if (currentStep === 3 && event.key === "Enter") {
            event.preventDefault();
            submitMatch();
        }
    });

    resetTutorial(false);
}
