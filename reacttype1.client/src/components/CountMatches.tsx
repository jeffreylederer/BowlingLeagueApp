function GetCount(): boolean {
    if (localStorage.getItem("matches") === null)
        return false;
    const value = localStorage.getItem("matches") as string;
    return value == 'true';
}

export function SetCount(value: boolean): void {
    localStorage.setItem("matches", value.toString());
}

export default GetCount;


