import { LightningElement } from 'lwc';

export default class SummaryComponet extends LightningElement {
    summary=""
    handleInput(event) {
        this.summary=event.target.value;
        this.update();
        // console.log('summary');
    }
    
    update() 
    {
       let ev=new CustomEvent('updatedsummary',{detail:this.summary});
       this.dispatchEvent(ev);
    }
}