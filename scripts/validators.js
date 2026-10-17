const patterns = {
    title: /^\S(?:.*\S)?$/,
    duration: /^(0|[1-9]\d*)(\.\d{1,2})?$/,
    date: /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/,
    tag: /^[A-Za-z]+(?:[ -][A-Za-z]+)*$/,
    time: /^(?:[01]\d|2[0-3]):[0-5]\d$/,
    duplicateWords: /\b(\w+)\s+\1\b/i
};
export function validateRecord(record){
    const errors = {};
    if (!patterns.title.test(record.title)){
        errors.title = "title can not be empty or start/end with spaces.";
    }
    if (!patterns.duration.test(String(record.duration))){
        errors.duration ="duration must be a valid positive number.";
    }
    if (!patterns.date.test(record.dueDate)){
        errors.date ="use a valid datte such as 2026-10-20.";
    }
    if (!patterns.tag.test(record.tag)){
        errors.tag ="category should contain letters,spaces, or hyphens.";
    }
    if (record.time && !patterns.time.test(record.time)){
        errors.time = "use a time such as 09:30.";
    }
    if (patterns.duplicateWords.test(record.title)){
        errors.title = "please avoid repeated words.";
    }
    return errors;
}
export function isValidRecord(record){
    return Objects.keys(validateRecord(record)).length === 0;
}
export function validateImportedData(data){
    if (!Array.isArray(data)){
        return false;
    }
    return data.every(record =>{
        return (
            record &&
            typeof record.id === "string" &&
            typeof record.title === "string" &&
            typeof record.dueDate ==="string" &&
            typeof record.tag ==="string" &&
            typeof record.duration === "number"
        );
    });
}