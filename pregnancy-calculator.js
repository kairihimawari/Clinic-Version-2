    function calculatePregnancy() {
        const lmpInput = document.getElementById("lmp").value;
        const resultDiv = document.getElementById("result");
        const progressBar = document.getElementById("progressBar");
        const babyImage = document.getElementById("babyImage");
        const shareButtons = document.getElementById("shareButtons");
        const loader = document.getElementById("loader");

        if (!lmpInput) {
            resultDiv.innerHTML = "<p style='color:red'>⚠ Please select your Last Menstrual Period (LMP).</p>";
            return;
        }

        // Show loader, clear previous result
        loader.style.display = "block";
        resultDiv.innerHTML = "";
        babyImage.innerHTML = "";
        shareButtons.style.display = "none";

        // Simulate short processing delay (1 second)
        setTimeout(() => {
            loader.style.display = "none"; // hide spinner

            // Convert LMP to date
            const lmpDate = new Date(lmpInput);
            const today = new Date();
            const diffTime = today - lmpDate;
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays < 0) {
                resultDiv.innerHTML = "<p style='color:red'>⚠ LMP cannot be in the future.</p>";
                return;
            }

            const weeks = Math.floor(diffDays / 7);
            const days = diffDays % 7;

            const dueDate = new Date(lmpDate);
            dueDate.setDate(dueDate.getDate() + 280);

            const progress = Math.min((weeks / 40) * 100, 100).toFixed(1);

            resultDiv.innerHTML = `
                <p><strong>Gestational Age:</strong> ${weeks} weeks and ${days} days</p>
                <p><strong>Estimated Due Date:</strong> ${dueDate.toDateString()}</p>
            `;

           progressBar.innerText = "0%"; 
    let current = 0;
    const target = parseFloat(progress);

    const animate = setInterval(() => {
        if (current >= target) {
            clearInterval(animate);
        } else {
            current += 1;
            progressBar.style.width = current + "%";
            progressBar.innerText = current + "%";
        }
    }, 20);

           
    let babyStageImg = "";
    let babyStageText = "";

    if (weeks <= 4) {
        babyStageImg = "https://i.imgur.com/3LcfmQm.png"; 
        babyStageText = "Weeks 0–4: Embryo starts forming";
    } else if (weeks <= 8) {
        babyStageImg = "https://i.imgur.com/TukT5Zw.png"; 
        babyStageText = "Weeks 5–8: Major organs begin developing";
    } else if (weeks <= 12) {
        babyStageImg = "https://i.imgur.com/J5U8YyY.png"; 
        babyStageText = "Weeks 9–12: Baby’s heartbeat can be detected";
    } else if (weeks <= 16) {
        babyStageImg = "https://i.imgur.com/De4wZcS.png"; 
        babyStageText = "Weeks 13–16: Baby’s facial features form";
    } else if (weeks <= 20) {
        babyStageImg = "https://i.imgur.com/XA0tBic.png"; 
        babyStageText = "Weeks 17–20: Baby can start to move";
    } else if (weeks <= 24) {
        babyStageImg = "https://i.imgur.com/3h3f2iH.png"; 
        babyStageText = "Weeks 21–24: Baby starts responding to sounds";
    } else if (weeks <= 28) {
        babyStageImg = "https://i.imgur.com/7PukRF7.png"; 
        babyStageText = "Weeks 25–28: Baby’s eyes begin to open";
    } else if (weeks <= 32) {
        babyStageImg = "https://i.imgur.com/qwF1M0S.png"; 
        babyStageText = "Weeks 29–32: Baby gains weight quickly";
    } else if (weeks <= 36) {
        babyStageImg = "https://i.imgur.com/k9YcYud.png"; 
        babyStageText = "Weeks 33–36: Baby practices breathing";
    } else {
        babyStageImg = "https://i.imgur.com/UBmNtvT.png"; 
        babyStageText = "Weeks 37–40: Baby is ready for birth";
    }

    babyImage.innerHTML = `
        <img src="${babyStageImg}" alt="Baby stage week ${weeks}" style="max-width:200px;margin-top:10px;">
        <p><strong>${babyStageText}</strong></p>
    `;

    babyImage.innerHTML = `
        <img src="${babyStageImg}" alt="Baby stage" style="max-width:200px;margin-top:10px;">
        <p><strong>Stage:</strong> ${weeks <= 8 ? "Stage 1 (Weeks 0–8)" : 
            weeks <= 16 ? "Stage 2 (Weeks 9–16)" : 
            weeks <= 24 ? "Stage 3 (Weeks 17–24)" : 
            weeks <= 32 ? "Stage 4 (Weeks 25–32)" : 
            "Stage 5 (Weeks 33–40)"}
        </p>
    `;

            const shareText = encodeURIComponent(
                `I am ${weeks} weeks and ${days} days pregnant. My due date is ${dueDate.toDateString()}!`
            );

            document.getElementById("whatsappShare").href = `https://wa.me/?text=${shareText}`;
            document.getElementById("viberShare").href = `viber://forward?text=${shareText}`;
            document.getElementById("telegramShare").href = `https://t.me/share/url?url=&text=${shareText}`;
             document.getElementById("facebookShare").href = `https://www.facebook.com/messages/t/805700862615682/share/url?url=&text=${shareText}`;

            shareButtons.style.display = "flex";
        }, 1000);
    }

    shareButtons.innerHTML = `
    <p style="margin-bottom:5px;font-weight:bold;text-align:center;">
        Share the result with us via WhatsApp, Facebook , Viber and Telegram:
    </p>
    ${shareButtons.innerHTML}
`;

shareButtons.style.display = "flex";