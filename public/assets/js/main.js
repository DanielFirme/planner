import { PlansRepository } from "./api/db/PlansRepository.js";
import { Plan } from "./api/plan/Plan.js";
import { PlanAreaController } from "./api/controllers/PlanAreaController.js";
import { PlanController } from "./api/controllers/PlanController.js";
import { TaskController } from "./api/controllers/TaskController.js";

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
    let widthTasksBox = $("#tasks--box").offsetWidth;
    if($('#menu').classList.contains('open')){
        widthTasksBox += 200;
    }
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
setWidthTaskBox(numberOfTasksBoxsRelatedToScreenWidth());




//NeutralArea Events
$$('.post-it-area').forEach(item=>{
    item.addEventListener('dragstart', dragStart);
    item.addEventListener('dragend', dragEnd);
});

//Areas Events
$$('.task--box--area').forEach(area=>{
    area.addEventListener('dragover', dragOver);
    area.addEventListener('dragleave', dragLeave);
    area.addEventListener('drop', drop); 
});

//Functions
export function dragStart(e){
    e.currentTarget.classList.add('dragging');
}
export function dragEnd(e){
    e.currentTarget.classList.remove('dragging');
}
function dragOver(e){
    e.preventDefault();
    e.currentTarget.classList.add('hover');
}

function dragLeave(e){
    e.currentTarget.classList.remove('hover');
}

function drop(e){
    const dropItem = $('.post-it-area.dragging');
    const dataTaskNumber = e.currentTarget.dataset.task; //or e.currentTarget.getAttribute('data-task');
    const dataTaskInfo = dropItem.dataset.taskinfo.split('|');
    const task = taskController.taskRead(...dataTaskInfo);
    
    switch (dataTaskNumber){
        case "0":
            taskController.taskCreate(dataTaskInfo[0], 0, task.content, task.color);
            break;
        case "1":
            taskController.taskCreate(dataTaskInfo[0], 1, task.content, task.color);
            break;
        case "2":
            taskController.taskCreate(dataTaskInfo[0], 2, task.content, task.color);
            break;
    }
    
    taskController.taskDelete(...dataTaskInfo);
    planAreaController.showPlanAreasTasks(3, dataTaskInfo[0]);
    e.currentTarget.classList.remove('hover');  
}


const plansRepo = new PlansRepository();
const planAreaController = new PlanAreaController();
const planController = new PlanController(plansRepo, planAreaController);
const taskController = new TaskController();

const planCreator = $('.plan-creator');

$('.new-plan-btn').addEventListener('click', ()=>{
    planCreator.classList.remove('hide');
});

$('.plan--creator--buttons button[type="reset"]')
    .addEventListener('click', ()=>{
        planCreator.classList.add('hide');
    });

$('#plan--creator--form')
.addEventListener('submit', (event)=>{
    event.preventDefault();
    const { target: formEvent } = event;

    const inputs = [...formEvent.elements].filter((input)=>{
        return input.type !== ('submit' || 'reset');
    });

    const plan = new Plan(inputs[0].value, inputs[1].value);
    plansRepo.create(plan);
    planController.showPlans();
    planCreator.classList.add('hide');
    planAreaController.showPlanAreasTasks(1, (plansRepo.read().length - 1));
    formEvent.reset();
});

const taskCriator = $('.new-task-criator');

$('#ntc--form')
.addEventListener('submit', (event)=>{
    event.preventDefault();
    const { target: formEvent } = event;
    const idPlan = event.currentTarget.parentNode.dataset.plan;

    const inputs = [...formEvent.elements].filter((input)=>{
        return input.type !== ('submit' || 'reset');
    });

    const idPlanArea = "0";
    taskController.taskCreate(idPlan, idPlanArea, inputs[0].value, inputs[1].value);
    planAreaController.showPlanAreasTasks(1, idPlan);
    formEvent.reset();
    taskCriator.style.opacity = 0;
    setTimeout(()=>{
        taskCriator.classList.add('hide');
    }, 500);
});

$('.ntc--form--buttons button[type="reset"]')
    .addEventListener('click', ()=>{
        taskCriator.style.opacity = 0;
        setTimeout(()=>{
            taskCriator.classList.add('hide');
        }, 500);
    });

planController.showPlans();

planAreaController.showPlanAreasTasks(3, 0);


