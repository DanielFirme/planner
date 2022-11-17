import { PlansRepository } from "../db/PlansRepository.js";
import { dragEnd, dragStart } from "../../main.js";
const $ = document.querySelector.bind(document);

export class PlanAreaController {
    constructor(){
        this.plansRepo = new PlansRepository();
    }

    planAreaUpdate(idPlan, idPlanArea, task){
        const plan = this.plansRepo.readID(idPlan);
        plan.areas[idPlanArea].tasks.push(task);
        this.plansRepo.update(idPlan, plan);
    }

    showPlanAreasTasks(numberPlanArea, idPlan){
        const postItAreaModel = $('.post-it-area.model');
        const data = $('.show--date');
        data.innerText = this.plansRepo.readID(idPlan).date;

        for(let idPlanArea = 0; idPlanArea < numberPlanArea; idPlanArea++){
            const area = this.readPlanArea(idPlan, idPlanArea);
            const postItBoxArea = $(`.task--box--area[data-task="${idPlanArea}"] .post--it--box--area`);
            while(postItBoxArea.querySelector('.post-it-area')){
                postItBoxArea.removeChild(postItBoxArea.querySelector('.post-it-area'));
            }

            area.tasks.forEach((task, idTask)=>{
                const postItArea = postItAreaModel.cloneNode(true);
                postItArea.classList.remove('hide');
                postItArea.classList.remove('model');
                postItArea.setAttribute('data-taskInfo', `${idPlan}|${idPlanArea}|${idTask}`);
                postItArea.style.backgroundColor = task.color;
                postItArea.querySelector('.post-it--main .pi-textarea').innerText = task.content;
                postItArea.addEventListener('dragstart', dragStart);
                postItArea.addEventListener('dragend', dragEnd);
                postItBoxArea.appendChild(postItArea);
            });
        };
    }

    readPlanArea(idPlan, idPlanArea){
        const plan = this.plansRepo.readID(idPlan);
        return plan.areas[idPlanArea];
    }
}