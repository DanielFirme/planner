const $ = document.querySelector.bind(document);

export class PlanController {
    constructor(plansRepo, planAreaController){
        this.plansRepo = plansRepo;
        this.planAreaController = planAreaController;
    }

    showPlans(){
        const dbPlans = this.plansRepo.read();
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
                    if(e.currentTarget.parentNode.querySelector('.plan span.plan--active')){
                        const idPlan = +e.currentTarget.parentNode.dataset.plan;
                        this.plansRepo.delete(idPlan);
                        this.showPlans();
                        this.planAreaController.showPlanAreasTasks(3, 0);
                    } else {
                        alert('Selecione o plano para deletar');
                    }
                    
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
                    $('.plan span.plan--active').classList.remove('plan--active');
                    e.currentTarget.classList.add('plan--active');
                    const idPlan = +e.currentTarget.parentNode.parentNode.dataset.plan;
                    this.planAreaController.showPlanAreasTasks(3, idPlan);
                });
            planUl.appendChild(planLiClone);
        });
    }
}