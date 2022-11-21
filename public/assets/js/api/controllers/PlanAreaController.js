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
        const dateShow = $('.show--date');
        if(planActive){
            planActive.classList.add('plan--active');
            
            const fullDate = (this.plansRepo.readID(idPlan).date).split('-');
            fullDate[1] = +fullDate[1] - 1;
            const date = new Date(...fullDate);
            dateShow.innerText = new Intl.DateTimeFormat('pt-BR').format(date);

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

                    switch (idPlanArea){
                        case 0:
                            postItArea.querySelector('.pi--icons').classList.add('flex-end');
                            postItArea.querySelector('.pi--icon--hourglass').classList.add('hide');
                            postItArea.querySelector('.pi--icon--checked').classList.add('hide');
                            postItArea.querySelector('.pi-arrows-area').classList.add('flex-end');
                            postItArea.querySelector('.pi--arrow-left').classList.add('hide');
                            postItArea.querySelector('.pi--arrow-right').classList.remove('hide');
                            
                            break;
                        case 1:
                            postItArea.querySelector('.pi--icons').classList.remove('flex-end');
                            postItArea.querySelector('.pi--icon--hourglass').classList.remove('hide');
                            postItArea.querySelector('.pi--icon--checked').classList.add('hide');
                            postItArea.querySelector('.pi-arrows-area').classList.remove('flex-end');
                            postItArea.querySelector('.pi--arrow-left').classList.remove('hide');
                            postItArea.querySelector('.pi--arrow-right').classList.remove('hide');
                            
                            break;
                        case 2:
                            postItArea.querySelector('.pi--icons').classList.remove('flex-end');
                            postItArea.querySelector('.pi--icon--hourglass').classList.add('hide');
                            postItArea.querySelector('.pi--icon--checked').classList.remove('hide');
                            postItArea.querySelector('.pi-arrows-area').classList.remove('flex-end');
                            postItArea.querySelector('.pi--arrow-left').classList.remove('hide');
                            postItArea.querySelector('.pi--arrow-right').classList.add('hide');
                            break;
                    }

                    postItArea.querySelector('.pi--icon--plus')
                        .addEventListener('click', ()=>{
                            if(postItAreaFloat.classList.contains('hide')
                            && postItTexAreaEdit.classList.contains('hide')){
                                postItAreaFloat.classList.remove('hide');
                            }
                        });

                    postItArea.querySelector('.pi--arrow-left')
                        .addEventListener('click', ()=>{
                            const task = this.taskController.taskRead(idPlan, idPlanArea, idTask);
                            switch (idPlanArea) {
                                case 1:
                                    this.taskController.taskCreate(idPlan, 0, task.content, task.color);
                                    break;
                                case 2:
                                    this.taskController.taskCreate(idPlan, 1, task.content, task.color);
                                    break;
                            }
                            this.taskController.taskDelete(idPlan, idPlanArea, idTask);
                            this.showPlanAreasTasks(3, idPlan);
                        });

                        postItArea.querySelector('.pi--arrow-right')
                        .addEventListener('click', ()=>{
                            const task = this.taskController.taskRead(idPlan, idPlanArea, idTask);
                            switch (idPlanArea) {
                                case 0:
                                    this.taskController.taskCreate(idPlan, 1, task.content, task.color);
                                    break;
                                case 1:
                                    this.taskController.taskCreate(idPlan, 2, task.content, task.color);
                                    break;
                            }
                            this.taskController.taskDelete(idPlan, idPlanArea, idTask);
                            this.showPlanAreasTasks(3, idPlan);
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
                            postItArea.setAttribute('draggable', 'false');
                            
                            const dataTaskInfo = postItArea.dataset.taskinfo.split('|');
                            const task = this.taskController.taskRead(...dataTaskInfo);
                            
                            postItTexAreaEdit.querySelector('#textarea-form-edit #tfe--task--name')
                                .value = task.content;
                            
                            postItTexAreaEdit.querySelector('#textarea-form-edit #tfe--task--color')
                                .value = task.color;
                        });

                    postItAreaFloat.querySelector('.pi--delete')
                        .addEventListener('click', ()=>{
                            const dataTaskInfo = postItArea.dataset.taskinfo.split('|');
                            this.taskController.taskDelete(...dataTaskInfo);
                            this.showPlanAreasTasks(3, dataTaskInfo[0]);
                        });

                    
                    postItTexAreaEdit.querySelector('.pi--xmark')
                        .addEventListener('click', ()=>{
                            postItArea.querySelector('.pi-textarea-edit')
                                .classList.add('hide');
                            postItArea.setAttribute('draggable', 'true');
                        });
                    
                    postItTexAreaEdit.querySelector('#textarea-form-edit')
                    .addEventListener('submit', (event)=>{
                        postItArea.querySelector('.pi-textarea-edit')
                            .classList.add('hide');
                        event.preventDefault();
                        const { target: formEvent } = event;
                        const inputs = [...formEvent.elements].filter((input)=>{
                            return input.type !== 'submit';
                        });
                        const dataTaskInfo = postItArea.dataset.taskinfo.split('|');
                        const task = this.taskController.taskRead(...dataTaskInfo);
                        task.content = inputs[0].value;
                        task.color = inputs[1].value;
                        this.taskController.taskUpdate(...dataTaskInfo, task);
                        this.showPlanAreasTasks(3, dataTaskInfo[0]);
                    });

                    postItBoxArea.appendChild(postItArea);
                });
            };
        } else {
            dateShow.innerText = "";
            for(let idPlanArea = 0; idPlanArea < numberPlanArea; idPlanArea++){
                const postItBoxArea = $(`.task--box--area[data-task="${idPlanArea}"] .post--it--box--area`);
                while(postItBoxArea.querySelector('.post-it-area')){
                    postItBoxArea.removeChild(postItBoxArea.querySelector('.post-it-area'));
                }
            }
        }
    }
}