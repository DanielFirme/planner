import { Plan } from "../plan/Plan.js";

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

export class PlansRepository {
    constructor() {
        this.getLocalStorage = function(){
            return JSON.parse(localStorage.getItem("dbPlans")) ?? [];
        }
        this.setLocalStorage = function(dbPlans){
            localStorage.setItem("dbPlans", JSON.stringify(dbPlans));
        }
    }

    read(){
        return this.getLocalStorage();
    }

    create(plan){
        const dbPlans = this.read();
    
        dbPlans.push(plan);
        this.setLocalStorage(dbPlans);
    }

    update(id, updatedPlan){
        const dbPlans = this.read();
        
        dbPlans[id] = updatedPlan;  
        this.setLocalStorage(dbPlans);
    }

    delete(idPlan){
        const dbPlans = this.read();

        dbPlans.splice(idPlan, 1);
        this.setLocalStorage(dbPlans);
    }

    readID(idPlan){
        const dbPlans = this.read();
        return dbPlans[idPlan];
    }

    showPlans(){
        const dbPlans = this.read();
        const planLi = $('.plan-model.hide');
        const planUl = $('.plans--list');
        while(planUl.querySelector('li')){
            planUl.removeChild(planUl.querySelector('li'));
        }
        dbPlans.forEach((plan, id) => {
            const planLiClone = planLi.cloneNode(true);
            planLiClone.classList.remove('hide');
            planLiClone.querySelector('.plan').innerHTML = `${plan.name}<span>ver</span>`;
            planLiClone.setAttribute('data-plan', id);
            planLiClone.querySelector('.delete-plan-btn')
                .addEventListener('click', (e)=>{
                    const idPlan = +e.currentTarget.parentNode.dataset.plan;
                    this.delete(idPlan);
                    this.showPlans();
                });
            planLiClone.querySelector('.new-task-btn')
                .addEventListener('click', ()=>{
                    const taskCriator = $('.new-task-criator');
                    taskCriator.setAttribute('data-plan', id);
                    taskCriator.classList.remove('hide');
                    setTimeout(()=>{
                        taskCriator.style.opacity = 1;
                    }, 10);
                });
            planLiClone.querySelector('.plan span')
                .addEventListener('click', (e)=>{
                    const idPlan = +e.currentTarget.parentNode.parentNode.dataset.plan;
                    plan = this.readID(idPlan);
                    console.log(plan);
                });
            planUl.appendChild(planLiClone);
        });
    }
}