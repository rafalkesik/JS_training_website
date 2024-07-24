// Opens or closes the menu bar in mobile view.
function menuBarChangeVisibility() {
    let label = document.querySelector('[for="menu-bar-visible"]');
    let checkbox = document.querySelector("#menu-bar-visible");
    let iconClassList = label.classList;
    let dropDownMenu = document.querySelector("#drop-down-menu");
    // The below one to be deleted, and the above to be uncommented.
    // let dropDownMenu = document.querySelector("#header-nav-links");

    if (checkbox.checked) {
        // dropDownMenu.style.display = 'block';
        iconClassList.add("highlight_text");
    } else {
        // dropDownMenu.style.display = 'none';
        iconClassList.remove("highlight_text");
    }
}