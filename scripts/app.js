import { getState, setRecords, setSearchText, setCaseSensitive, setSortBy, setWeeklyTarget } from "./state.js";
import{
    saveRecords,
    loadRecords,
    saveSettings,
    loadSettings
} from "./storage.js";
import{
    validateRecord,
    validateImportedData
} from "./validators.js";
import{
    renderRecords,
    updateStats,
    showForm,
    showErrors
} from "./ui.js";
const state = getState();
setRecords(loadRecords());
const savedSettings = loadSettings();
setWeeklyTarget(savedSettings.weeklyTarget);
document.querySelector("#weekly-target").value =
state.settings.weeklyTarget;
function refresh(){
    renderRecords(editRecord, deleteRecord);
    updateStats(state.records);
    updateTargetMessage();
}
function showSection(sectionId) {
    const sections = document.querySelectorAll("main section");
    sections.forEach(section => {
        section.hidden = true;
    });
    const selectedSection = document.querySelector(`#${sectionId}`);
    if (selectedSection) {
        selectedSection.hidden = false;
    }
}
function updateTargetMessage() {
    const today = new Date();
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 6);
    const total = state.records.reduce(
        (sum, record) => {
            const recordDate = new Date(record.dueDate + "T00:00:00");
            if (recordDate >= sevenDaysAgo && recordDate <= today) {
                return sum + Number(record.duration);
            }
            return sum;
        },
        0
    );
    const target = Number(state.settings.weeklyTarget);
    const message = document.querySelector("#target-message");
    if (!message) return;
    if (total > target) {
        message.textContent =
        `Target exceeded by ${total - target} minutes.`;
        message.setAttribute("aria-live", "assertive");
    } else{
        message.textContent =
        `${target - total} minutes remaining to reach your target.`;
        message.setAttribute("aria-live", "polite");
    }
}
document.querySelector("#record-form").addEventListener(
    "submit",
    event => {
        event.preventDefault();
        const id =
        document.querySelector("#record-id").value;
        const record ={
            id: id || crypto.randomUUID(),
            title:
            document.querySelector("#title").value.trim(),
            dueDate:
            document.querySelector("#due-date").value,
            duration:
            Number(
            document.querySelector("#duration").value
            ),
            tag:
            document.querySelector("#tag").value.trim(),
            time:
            document.querySelector("#time").value,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString() 
        };
        if (id) {
            const oldRecord =
            state.records.find(item => item.id === id);
            if (oldRecord) {
                record.createdAt = oldRecord.createdAt;
            }
        }
        const errors = validateRecord(record);
        showErrors(errors);
        if (Object.keys(errors).length > 0) {
            return;
        }
        if (id) {
            state.records = state.records.map(item =>
                item.id === id ? record : item
            );
        } else {
            state.records.push(record);
        }
        saveRecords(state.records);
        document.querySelector("#form-status").textContent =
        "Record saved successfully.";
        showForm();
        refresh();
    }
);
function editRecord(id) {
    const record =
    state.records.find(item => item.id === id);
    if (!record) return;
    showForm(record);
    document.querySelector("#add-record").scrollIntoView({
        behavior: "smooth"
    });
}
function deleteRecord(id) {
    const record =
    state.records.find(item => item.id ===id);
    if (!record) return;
    const confirmed = confirm(
        `Delete "${record.title}"?`
    );
    if (!confirmed) return;
    state.records =
    state.records.filter(item => item.id !== id);
    saveRecords(state.records);
    refresh();
}
document.querySelector("#cancel-edit").addEventListener(
    "click",
    () => {
        showForm();
        document.querySelector("#form-errors").textContent = "";
    }
);
document.querySelector("#search").addEventListener(
    "input",
    event => {
        setSearchText(event.target.value);
        refresh();
    }
);
document.querySelector("#case-sensitive").addEventListener(
    "change",
    event => {
        setCaseSensitive(event.target.checked);
        refresh();
    }
);
document.querySelector("#sort-by").addEventListener(
    "change",
    event => {
        setSortBy(event.target.value);
        refresh();
    }
);
document.querySelector("#save-settings").addEventListener(
    "click",
    () => {
        const value =
        Number(
            document.querySelector("#weekly-target").value
        );
        setWeeklyTarget(value);
        saveSettings(state.settings);
        document.querySelector("#settings-status").textContent =
        "Settings saved.";
        updateTargetMessage();
    }
);
document.querySelector("#minutes-input").addEventListener(
    "input",
    event => {
        const minutes = Number(event.target.value);
        const hours = minutes / 60;
        document.querySelector("#hours-output".textContent =
            `${hours.toFixed(2)} hours` );
    }
);
document.querySelector("#export-data").addEventListener(
    "click",
    () => {
        const data = JSON.stringify(
            state.records,
            null,
            2
        );
        const blob = new Blob(
            [data],
            {type: "application/json"}
        );
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "campus-planner-data.json";
        link.click();
        URL.revokeObjectURL(url);
    }
);
document.querySelector("#import-data").addEventListener(
    "change",
    event => {
        const file = event.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
            try {
                const data = JSON.parse(reader.result);
                if (!validateImportedData(data)){
                    throw new Error("Invalid data");
                }
                state.records = data;
                saveRecords(state.records);
                document.querySelector("#settings-status").textContent =
                "Data imported successfully.";
                refresh();
            } catch (error) {
                document.querySelector("#settings-status").textContent =
                "The JSON file is invalid.";
            }
        };
        reader.readAsText(file);
    }
);
const darkModeButton =
document.querySelector("#dark-mode");
if (darkModeButton) {
    darkModeButton.addEventListener(
        "click",
        () => {
            document.body.classList.toggle("dark-mode");
        }
    );
}
document.querySelectorAll("nav a").forEach(link => {
    link.addEventListener("click", event => {
        event.preventDefault();
        const sectionId = link.getAttribute("href").substring(1);
        showSection(sectionId);
    });
});
showSection("dashboard");
refresh();