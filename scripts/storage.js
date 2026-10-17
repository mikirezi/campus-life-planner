const RECORDS_KEY ="campusplannerrecords";
const SETTINGS_KEY ="campusplannersettings";
export function saveRecords(records){
    localStorage.setItem(RECORDS_KEY, JSON.stringify(records));
}
export function loadRecords() {
    try{
        const data = localStorage.getItem(RECORDS_KEY);
        if (!data){
            return [];
        }
        return JSON.parse(data);
    } catch (error){
        console.error("could not load records:",error);
        return[];
    }
}
export function saveSettings(settings){
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}
export function loadSettings(){
    try{
        const data = localStorage.getItem(SETTINGS_KEY);
        if (!data){
            return{
                weeklyTarget: 600
            };
        }
        return JSON.parse(data);
    }catch (error){
        return{
            weeklyTarget: 600
        };
    }
}