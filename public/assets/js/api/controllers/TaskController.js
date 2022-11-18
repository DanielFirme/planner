import { PlansRepository } from "../db/PlansRepository.js";
import { Task } from "../task/Task.js";

export class TaskController {
    constructor(){
        this.plansRepo = new PlansRepository();
    }

    taskRead(idPlan, idPlanArea, idTask){
        const plan = this.plansRepo.readID(idPlan);
        const task = plan.areas[idPlanArea].tasks[idTask];
        return task;
    }

    taskUpdate(idPlan, idPlanArea, idTask, task){
        const newPlan = this.plansRepo.readID(idPlan);
        newPlan.areas[idPlanArea].tasks[idTask] = task;
        this.plansRepo.update(idPlan, newPlan);
    }

    taskDelete(idPlan, idPlanArea, idTask){
        const newPlan = this.plansRepo.readID(idPlan);
        newPlan.areas[idPlanArea].tasks.splice(idTask, 1);
        this.plansRepo.update(idPlan, newPlan);
    }

    taskCreate(idPlan, idPlanArea, content, color){
        const task = new Task(content, color);
        const newPlan = this.plansRepo.readID(idPlan);
        newPlan.areas[idPlanArea].tasks.push(task);
        this.plansRepo.update(idPlan, newPlan);
    }
}