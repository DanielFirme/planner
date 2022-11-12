const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const taskBox = $$('.task--box');
let numberTasksBoxsOnScreen;

function numberOfTasksBoxsRelatedToScreenWidth(){
    const screenWidth = $('body').clientWidth;
    if(screenWidth >= 1000){
        return 3;
    } else if (screenWidth < 1000 && screenWidth > 640){
        return 2;
    } else {
        return 1;
    }
}

function setWidthTaskBox(numberTasksBoxOnScreen) {
    const widthTasksBox = $("#tasks--box").offsetWidth;
    const widthTaskBox = (widthTasksBox / numberTasksBoxOnScreen);
    taskBox.forEach(item => {
        item.style.width = `${widthTaskBox}px`;
    });
}

function toggleMenu(e){
    e.currentTarget.classList.toggle('menu--button--rotate');
    $('#menu').classList.toggle('open');
}

window.addEventListener('resize', () => {
    numberTasksBoxsOnScreen = numberOfTasksBoxsRelatedToScreenWidth();
    setWidthTaskBox(numberTasksBoxsOnScreen);
});

$('.menu--button').addEventListener('click', toggleMenu);