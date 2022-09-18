export function isValid(string) {
    if (string.length > 9)
        return true
    return false
}

export function createModal(title, content){
    const modal = document.createElement('div')
    modal.classList.add('modal')
    const html = `
    <h1>${title}</h1>
    <div class="modal-content">${content}</div>
`
    modal.innerHTML=html
    mui.overlay('on', modal);
}