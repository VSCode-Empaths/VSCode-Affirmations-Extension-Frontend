const fetch = require("cross-fetch");

async function fetchAffirmations() {
    const resp = await fetch(`http://localhost:7890/api/v1/affirmations`, {
        method: "GET",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
    });
    const data = await resp.json();
    return data;
}

async function fetchCategories(id) {
    const resp = await fetch(`http://localhost:7890/api/v1/categories/${id}`, {
        method: "GET",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
    });
    const data = await resp.json();
    return data;
}

module.exports = { fetchAffirmations, fetchCategories };
