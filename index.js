const tutorial = document.getElementById("tutorial");

if (tutorial) {
    const initialBoard = [
        "blue", "orange", "red", "white", "yellow",
        "green", "yellow", "green", "orange", "white",
        "red", "blue", null, "green", "yellow",
        "yellow", "blue", "yellow", "red", "white",
        "orange", "green", "red", "blue", "yellow"
    ];
    const targetPattern = [
        "green", "red", "orange",
        "yellow", "blue", "green",
        "blue", "yellow", "red"
    ];
    const centerIndices = [6, 7, 8, 11, 12, 13, 16, 17, 18];
    const solution = [
        { direction: "right", symbol: "→", color: "blue", targetIndex: 4 },
        { direction: "down", symbol: "↓", color: "yellow", targetIndex: 3 },
        { direction: "left", symbol: "←", color: "green", targetIndex: 0 },
        { direction: "down", symbol: "↓", color: "red", targetIndex: 1 }
    ];

    const cells = [...tutorial.querySelectorAll("[data-cell]")];
    const targetCells = [...tutorial.querySelectorAll("[data-target-cell]")];
    const title = tutorial.querySelector("[data-tutorial-title]");
    const description = tutorial.querySelector("[data-tutorial-description]");
    const stepLabel = tutorial.querySelector("[data-tutorial-step]");
    const feedback = tutorial.querySelector("[data-tutorial-feedback]");
    const actionButton = tutorial.querySelector("[data-tutorial-action]");
    const demoButton = tutorial.querySelector("[data-watch-demo]");
    const resetButton = tutorial.querySelector("[data-reset-tutorial]");
    const submitButton = tutorial.querySelector("[data-submit]");
    const practiceBadge = tutorial.querySelector(".practice-badge");
    const boardTitle = tutorial.querySelector(".tutorial-stage-heading strong");
    const moveCount = tutorial.querySelector("[data-move-count]");
    const matchCount = tutorial.querySelector("[data-match-count]");
    const targetLabel = tutorial.querySelector("[data-target-label]");
    const directionButtons = [...tutorial.querySelectorAll("[data-direction]")];
    const progressItems = [...tutorial.querySelectorAll("[data-progress]")];
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    let board = initialBoard.slice();
    let currentStep = 1;
    let solutionIndex = 0;
    let isMoving = false;
    let demoRun = 0;

    function wait(milliseconds) {
        return new Promise((resolve) => window.setTimeout(resolve, milliseconds));
    }

    function setActionLabel(label) {
        actionButton.firstChild.textContent = `${label} `;
    }

    function cancelDemo() {
        demoRun += 1;
        demoButton.disabled = false;
        demoButton.innerHTML = '<span aria-hidden="true">▶</span> Watch demo';
    }

    function getMove(direction) {
        const emptyIndex = board.indexOf(null);
        const row = Math.floor(emptyIndex / 5);
        const column = emptyIndex % 5;
        let sourceIndex = -1;

        if (direction === "right" && column > 0) sourceIndex = emptyIndex - 1;
        if (direction === "left" && column < 4) sourceIndex = emptyIndex + 1;
        if (direction === "down" && row > 0) sourceIndex = emptyIndex - 5;
        if (direction === "up" && row < 4) sourceIndex = emptyIndex + 5;

        return sourceIndex < 0 ? null : { sourceIndex, emptyIndex };
    }

    function matchesTarget() {
        return centerIndices.every((boardIndex, patternIndex) => (
            board[boardIndex] === targetPattern[patternIndex]
        ));
    }

    function renderBoard() {
        cells.forEach((cell, index) => {
            const color = board[index];
            const classes = [color ? `tile-${color}` : "empty-tile"];
            if (centerIndices.includes(index)) classes.push("goal-cell");
            cell.className = classes.join(" ");
        });

        moveCount.textContent = String(solutionIndex);
        tutorial.setAttribute(
            "aria-label",
            `Interactive tutorial. Step ${currentStep}. ${solutionIndex} of ${solution.length} puzzle moves complete.`
        );

        if (currentStep === 2 && solutionIndex < solution.length) {
            const suggestedMove = getMove(solution[solutionIndex].direction);
            if (suggestedMove) {
                cells[suggestedMove.sourceIndex].classList.add("suggested-tile");
                cells[suggestedMove.emptyIndex].classList.add("destination-cell");
            }
        }

        directionButtons.forEach((button) => {
            const isSuggested = currentStep === 2
                && solutionIndex < solution.length
                && button.dataset.direction === solution[solutionIndex].direction;
            button.classList.toggle("is-suggested", isSuggested);
        });

        let matchedCells = 0;
        targetCells.forEach((cell, patternIndex) => {
            const isMatched = board[centerIndices[patternIndex]] === targetPattern[patternIndex];
            const isTarget = currentStep === 2
                && solutionIndex < solution.length
                && solution[solutionIndex].targetIndex === patternIndex;
            cell.classList.toggle("is-matched", isMatched);
            cell.classList.toggle("target-focus", isTarget);
            if (isMatched) matchedCells += 1;
        });
        matchCount.textContent = `${matchedCells} / 9`;

        if (currentStep === 2 && solutionIndex < solution.length) {
            targetLabel.textContent = `${solution[solutionIndex].color} goes here`;
        } else if (matchedCells === 9) {
            targetLabel.textContent = "Target complete";
        } else {
            targetLabel.textContent = "Copy this target";
        }
    }

    function updateProgress(step) {
        const numericStep = step === "complete" ? 4 : step;
        progressItems.forEach((item) => {
            const itemStep = Number(item.dataset.progress);
            const isCurrent = itemStep === numericStep;
            item.classList.toggle("is-active", isCurrent);
            item.classList.toggle("is-complete", itemStep < numericStep);
            if (isCurrent) item.setAttribute("aria-current", "step");
            else item.removeAttribute("aria-current");
        });
    }

    function updateSolvePrompt() {
        const nextMove = solution[solutionIndex];
        stepLabel.textContent = `Solve · Move ${solutionIndex + 1} of ${solution.length}`;
        title.textContent = `Move ${solutionIndex + 1}: send ${nextMove.color} to its target`;
        description.textContent = `Follow 1 → 2 → 3: move the highlighted ${nextMove.color} tile ${nextMove.direction} into the outlined empty square. That fixes the matching square highlighted in the target.`;
        feedback.textContent = `Press ${nextMove.symbol}. Arrows describe the tile's movement; the empty space shifts the opposite way.`;
        setActionLabel("Show next move");
    }

    function updateTutorial(step) {
        currentStep = step;
        tutorial.dataset.step = String(step);
        updateProgress(step);

        directionButtons.forEach((button) => {
            button.disabled = step !== 2;
        });
        submitButton.disabled = step !== 3;

        if (step === 1) {
            stepLabel.textContent = "Step 1 of 3 · Goal";
            title.textContent = "Goal: match the center 3×3";
            description.textContent = "Compare the nine outlined board squares with the target card. Green-outlined target squares already match; the other four still need the correct colors.";
            feedback.textContent = "Your goal is 9 / 9 matched. Tiles outside the outline can be moved into the center through the empty space.";
            setActionLabel("Start mini puzzle");
            boardTitle.textContent = "Match the outlined 3×3";
            practiceBadge.textContent = "Practice";
        } else if (step === 2) {
            updateSolvePrompt();
            boardTitle.textContent = "Solve the four-move pattern";
            practiceBadge.textContent = "In progress";
            tutorial.focus({ preventScroll: true });
        } else if (step === 3) {
            stepLabel.textContent = "Step 3 of 3 · Submit";
            title.textContent = "The center matches—submit it";
            description.textContent = "All nine outlined colors now match the target. In the full game, the puzzle only ends after you submit the pattern.";
            feedback.textContent = "Press Enter on your keyboard or use the Enter button below.";
            setActionLabel("Submit match");
            boardTitle.textContent = "Target pattern complete";
            practiceBadge.textContent = "Matched";
        } else {
            stepLabel.textContent = "Tutorial complete";
            title.textContent = "That is the complete game loop";
            description.textContent = "Read the target, slide neighboring tiles through the empty space, match the center 3×3, and submit your solution.";
            feedback.textContent = "Now try a randomized board on your own or race a friend.";
            setActionLabel("Choose a mode");
            boardTitle.textContent = "Mini puzzle complete";
            practiceBadge.textContent = "Complete";
        }

        renderBoard();
    }

    function resetBoard() {
        board = initialBoard.slice();
        solutionIndex = 0;
        isMoving = false;
        tutorial.classList.remove("is-solved", "is-shaking");
    }

    function resetTutorial(showGoal = true, cancelPlayback = true) {
        if (cancelPlayback) cancelDemo();
        else demoRun += 1;
        resetBoard();
        updateTutorial(showGoal ? 1 : 2);
    }

    async function makeMove(direction, fromDemo = false) {
        if (currentStep !== 2 || isMoving) return;

        const expectedMove = solution[solutionIndex];
        if (direction !== expectedMove.direction) {
            if (!fromDemo) cancelDemo();
            tutorial.classList.remove("is-shaking");
            void tutorial.offsetWidth;
            tutorial.classList.add("is-shaking");
            feedback.textContent = `That direction does not solve the next part of this target. Follow the highlighted tile: ${expectedMove.symbol}.`;
            window.setTimeout(() => tutorial.classList.remove("is-shaking"), 360);
            return;
        }

        if (!fromDemo) cancelDemo();
        const move = getMove(direction);
        if (!move) return;

        isMoving = true;
        feedback.textContent = `Good—the ${expectedMove.color} tile moved ${direction}, while the empty space moved the opposite way.`;
        cells[move.sourceIndex].classList.add(`is-sliding-${direction}`);

        await wait(reduceMotion.matches ? 30 : 430);
        board[move.emptyIndex] = board[move.sourceIndex];
        board[move.sourceIndex] = null;
        solutionIndex += 1;
        isMoving = false;

        if (matchesTarget()) updateTutorial(3);
        else updateTutorial(2);
    }

    function submitMatch(fromDemo = false) {
        if (currentStep !== 3) return;
        if (!fromDemo) cancelDemo();
        updateTutorial("complete");
        tutorial.classList.add("is-solved");
    }

    async function watchDemo() {
        resetTutorial(true, false);
        const thisRun = demoRun;
        demoButton.disabled = true;
        demoButton.textContent = "Playing demo…";

        await wait(reduceMotion.matches ? 120 : 900);
        if (thisRun !== demoRun) return;
        updateTutorial(2);

        for (const move of solution) {
            await wait(reduceMotion.matches ? 120 : 850);
            if (thisRun !== demoRun) return;
            await makeMove(move.direction, true);
        }

        await wait(reduceMotion.matches ? 120 : 850);
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
            makeMove(solution[solutionIndex].direction);
        } else if (currentStep === 3) {
            submitMatch();
        } else {
            window.location.href = "choose.html";
        }
    });

    directionButtons.forEach((button) => {
        button.addEventListener("click", () => makeMove(button.dataset.direction));
    });

    submitButton.addEventListener("click", () => submitMatch());
    resetButton.addEventListener("click", () => resetTutorial(false));
    demoButton.addEventListener("click", watchDemo);

    tutorial.addEventListener("keydown", (event) => {
        const direction = event.key.startsWith("Arrow")
            ? event.key.replace("Arrow", "").toLowerCase()
            : null;

        if (currentStep === 2 && direction) {
            event.preventDefault();
            makeMove(direction);
        } else if (currentStep === 3 && event.key === "Enter") {
            event.preventDefault();
            submitMatch();
        }
    });

    resetTutorial(true, false);
}
