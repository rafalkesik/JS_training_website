// Opens or closes the menu bar in mobile view.
function menuBarChangeVisibility() {
    let label = document.querySelector('[for="menu-bar-visible"]');
    let checkbox = document.querySelector("#menu-bar-visible")
    console.log(label.innerHTML);
    console.log(checkbox.checked);
    
    if (checkbox.checked) {
        // display the menu bar
        // & Change the icon to "Close" text
    } else {
        // hide the menu bar
        // & Change the "Close" text to icon
    }
}