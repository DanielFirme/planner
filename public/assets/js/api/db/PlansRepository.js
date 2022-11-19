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
}