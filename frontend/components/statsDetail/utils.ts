export function formatDate(dateString: string | null) {
    if (!dateString) return "—";

    const [year, month, day] = dateString.split("-");
    return `${day}.${month}.${year}`;
}