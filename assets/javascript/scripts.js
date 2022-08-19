document.getElementById('menu-hamburger').addEventListener('click', e => {
  if (document.getElementById('nav-list').style.display == 'block') {
    document.getElementById('nav-list').style.display = 'none';
    document.getElementById('nav-bar-left').style.bottom = '';
    return;
  };
  document.getElementById('nav-list').style.display = 'block';
  document.getElementById('nav-bar-left').style.bottom = '0';
})

const dropdowns = document.getElementsByClassName('menu-dropdown');
for (i = 0; i < dropdowns.length; i++) {
  dropdowns[i].addEventListener('click', event => {
    let clicked;
    if (event.target.matches('.menu-dropdown')) {clicked = event.target};
    if (event.target.closest('.menu-dropdown')) {clicked = event.target.closest('.menu-dropdown')};
    if  (clicked.nextElementSibling.style.height == 'auto') {
      clicked.nextElementSibling.style.height = '0';
      return;
    }
    clicked.nextElementSibling.style.height = 'auto';
  })
};