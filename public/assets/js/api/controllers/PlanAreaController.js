import { PlansRepository } from "../db/PlansRepository.js";
import { dragEnd, dragStart } from "../../main.js";
import { TaskController } from "./TaskController.js";

const $ = document.querySelector.bind(document);

export class PlanAreaController {
    constructor(){
        this.plansRepo = new PlansRepository();
        this.taskController = new TaskController();
    }

    readPlanArea(idPlan, idPlanArea){
        const plan = this.plansRepo.readID(idPlan);
        return plan.areas[idPlanArea];
    }

    showPlanAreasTasks(numberPlanArea, idPlan){
        const planActive = $(`.plan-model[data-plan="${idPlan}"] .plan span`);
        const postItAreaModel = $('.post-it-area.model');
        const data = $('.show--date');
        if(planActive){
            planActive.classList.add('plan--active');
            data.innerText = this.plansRepo.readID(idPlan).date;

            for(let idPlanArea = 0; idPlanArea < numberPlanArea; idPlanArea++){
                const area = this.readPlanArea(idPlan, idPlanArea);
                const postItBoxArea = $(`.task--box--area[data-task="${idPlanArea}"] .post--it--box--area`);
                while(postItBoxArea.querySelector('.post-it-area')){
                    postItBoxArea.removeChild(postItBoxArea.querySelector('.post-it-area'));
                }

                area.tasks.forEach((task, idTask)=>{
                    const postItArea = postItAreaModel.cloneNode(true);
                    const postItAreaFloat = postItArea.querySelector('.post-it--float');
                    const postItTexAreaEdit = postItArea.querySelector('.pi-textarea-edit');
                    
                    postItArea.classList.remove('hide', 'model');
                    postItArea.setAttribute('data-taskInfo', `${idPlan}|${idPlanArea}|${idTask}`);
                    postItArea.style.backgroundColor = task.color;
                    postItArea.querySelector('.post-it--main .pi-textarea').innerText = task.content;
                    postItArea.addEventListener('dragstart', dragStart);
                    postItArea.addEventListener('dragend', dragEnd);

                    postItArea.querySelector('.pi--icon--plus')
                        .addEventListener('click', ()=>{
                            if(postItAreaFloat.classList.contains('hide')
                            && postItTexAreaEdit.classList.contains('hide')){
                                postItAreaFloat.classList.remove('hide');
                            }
                        });
                    
                    postItAreaFloat.querySelector('.pi--xmark')
                        .addEventListener('click', ()=>{
                            postItArea.querySelector('.post-it--float')
                                .classList.add('hide');
                        });

                    postItAreaFloat.querySelector('.pi--edit')
                        .addEventListener('click', ()=>{
                            postItArea.querySelector('.post-it--float')
                                .classList.add('hide');
                            postItArea.querySelector('.pi-textarea-edit.hide')
                                .classList.remove('hide');
                        });

                    postItAreaFloat.querySelector('.pi--delete')
                        .addEventListener('click', (event)=>{
                            const dataTaskInfo = event.currentTarget
                                .parentNode.parentNode.dataset.taskinfo.split('|');
                            this.taskController.taskDelete(...dataTaskInfo);
                            this.showPlanAreasTasks(3, dataTaskInfo[0]);
                        });

                    
                    postItTexAreaEdit.querySelector('.pi--xmark')
                        .addEventListener('click', ()=>{
                            postItArea.querySelector('.pi-textarea-edit')
                                .classList.add('hide');
                        });

                    postItBoxArea.appendChild(postItArea);
                });
            };
        } else {
            data.innerText = "";
            for(let idPlanArea = 0; idPlanArea < numberPlanArea; idPlanArea++){
                const postItBoxArea = $(`.task--box--area[data-task="${idPlanArea}"] .post--it--box--area`);
                while(postItBoxArea.querySelector('.post-it-area')){
                    postItBoxArea.removeChild(postItBoxArea.querySelector('.post-it-area'));
                }
            }
        }
    }
}