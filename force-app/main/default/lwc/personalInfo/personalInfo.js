import { LightningElement } from 'lwc';

export default class PersonalInfo extends LightningElement {
    personalinfo={}
    handleInput(event) {
        let fieldname=event.target.dataset.field;
        let fieldvalue=event.target.value;
        console.log(fieldname, fieldvalue);
        this.personalinfo[fieldname] = fieldvalue;
        this.update();
    }
    
    update() 
    {
       let ev=new CustomEvent('updated',{detail:this.personalinfo});
       this.dispatchEvent(ev);
    }
}