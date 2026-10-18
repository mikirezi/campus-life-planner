import { getState } from "./state.js";
import { compileRegex, recordMatches, highlightText }from "./search.js";
export function renderRecords(onEdit, onDelete) {
    const state = getState();
    const body = document.querySelector("#records-body");
    const emptyMessage = document.querySelector("#empty-message");
    let records = [...state.records];
    const regex = state.searchText
    ? compileRegex(state.searchText, state.caseSensitive)
    : null;
    if (state.searchText && !regex){
        if (emptyMessage) {
        emptyMessage.textContent = "Invalid search patter.";
        emptyMessage.hidden = false;
        }
        body.innerHTML ="";
        return;
    }
records = records.filter(record =>{
    return recordMatches(record, regex);
});
if (state.sortBy === "title"){
    records.sort((a, b) =>
        a.title.localeCompare(b.title)
    );
}
if (state.sortBy === "date") {
    records.sort((a,b) =>
    a.dueDate.localeCompare(b.dueDate)
);
}
if (state.sortBy === "duration-up"){
    records.sort((a,b) =>
    a.duration - b.duration
);
}
if (state.sortBy === "duration-down") {
    records.sort((a, b) =>
        b.duration - a.duration
    );
}
body.innerHTML = "";
if (emptyMessage) {
emptyMessage.hidden = records.length !==0;
}
records.forEach(record => {
    const row = document.createElement("tr");
    row.innerHTML = `
    <td>${highlightText(record.title, regex)}</td>
    <td>${highlightText(record.dueDate, regex)}</td>
    <td>${record.duration} minutes</td>
    <td>${highlightText(record.tag, regex)}</td>
    <td>${highlightText(record.time || "", regex)}</td>
    <td>
    <button class="edit-button" data-id="${record.id}">
    Edit
    </button>
    <button class="delete-button" data-id="${record.id}">
    Delete
    </button>
    </td>
    `;
    body.appendChild(row);
});
document.querySelectorAll(".edit-button").forEach(button => {
    button.addEventListener("click", () => {
        onEdit(button.dataset.id);
    });
});
document.querySelectorAll(".delete-button").forEach(button => {
    button.addEventListener("click", () => {
        onDelete(button.dataset.id);
    });   
});
}
export function updateStats(records){
    const total = records.length;
    const totalDuration = records.reduce(
       (sum, record) => sum + Number(record.duration),
       0 
    );
    const categoryCount ={};
    records.forEach(record => {
        categoryCount[record.tag] =
        (categoryCount[record.tag]||0) + 1;
    });
    let topCategory = "None";
    Object.keys(categoryCount).forEach(category => {
        if (
            topCategory === "None" ||
            categoryCount[category] >
            categoryCount[topCategory]
        ){
            topCategory = category;
        }
    });
    document.querySelector("#total-records").textContent = total;
    document.querySelector("#total-duration").textContent=`${totalDuration}min`;
    document.querySelector("#top-category").textContent= topCategory;
    renderChart(records);
}
export function renderChart(records){
    const chart = document.querySelector("#weekly-chart");
    if (!chart) return;
    chart.innerHTML = "";
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        const dateString =
        date.toISOString().split("T")[0];
        const totalMinutes = records
        .filter(record => record.dueDate === dateString)
        .reduce((sum, record) => sum + Number(record.duration), 0);
        const bar = document.createElement("div");
        bar.className = "chart-bar";
        bar.style.height =
        `${Math.max(totalMinutes, 8)}px` ;
        bar.innerHTML = `
        <div class="chart-label">
        ${date.getMonth() + 1}/${date.getDate()}
        <br>
        ${totalMinutes} min
        </div>
                `;
                chart.appendChild(bar);
    }
}
    export function showForm(record  =  null){
    const form = document.querySelector("#record-form");
    if (!form) return;
    form.reset();
    document.querySelector("#record-id").value=
    record ? record.id : "";
    if (record) {
    document.querySelector("#title").value =
    record.title;
    document.querySelector("#due-date").value =
    record.dueDate;
    document.querySelector("#duration").value =
    record.duration;
    document.querySelector("#tag").value =
    record.tag;
    document.querySelector("#time").value =
    record.time || "";
    }
    }
    export function showErrors(errors) {
    const box = document.querySelector("#form-errors");
    if (!box)return;
    const messages = Object.values(errors);
    box.innerHTML = messages.join("<br>");
    }