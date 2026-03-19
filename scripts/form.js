const gen_form = document.getElementById('gen_form');

for (let child of gen_form.children) {
    if (child instanceof HTMLInputElement) {
        child.baseText = child.labels[0].textContent
        child.labels[0].textContent = child.baseText + ` (${child.value})`
        child.addEventListener('input', (event) => {
            child.labels[0].textContent = child.baseText + ` (${child.value})`
        })
    }
}