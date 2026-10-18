export function compileRegex(text, caseSensitive = false){
    try {
        const flags = caseSensitive ? "g" : "gi";
        return new RegExp(text, flags);
    } catch (error){
        return null;
    }
}
export function recordMatches(record, regex) {
    if (!regex) {
        return true;
    }
    regex.lastIndex = 0;
    const text = `
    ${record.title}
    ${record.tag}
    ${record.dueDate}
    ${record.time|| ""}
    `;
    return regex.test(text);
}
export function escapeHtml(text){
    return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039");
}
export function highlightText(text, regex){
    const safeText = escapeHtml(text);
    if (!regex){
        return safeText;
    }
    try{
        const newRegex = new RegExp(
            regex.source,
            regex.flags.includes("i") ? "gi" : "g"
        );
        return safeText.replace(newRegex, match => {
            return `<mark>${match}</mark>`;
        });
    } catch {
        return safeText;
    }
}