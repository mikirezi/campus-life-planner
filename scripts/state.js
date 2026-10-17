const state = {
    records: [],
    settings: {
        weeklyTarget: 600
    },
    searchText: "",
    caseSensitive: false,
    sortBy: "date"
};
export function getState() {
    return state;
}
export function setRecords(records){
    state.records = records;
}
export function setSearchText(text){
    state.searchText =text;
}
export function setCaseSensitive(value){
    state.caseSensitive = value;
}
export function setSortBy(value){
    state.sortBy = value;
}
export function setWeeklyTarget(value) {
    state.settings.weeklyTarget = value;
}