async function GetHomepageData() {
    const response = await fetch('/api/homepage');
    const data = await response.json();
    return data;
}