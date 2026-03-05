import { LightningElement } from 'lwc';

export default class SkillsComponents extends LightningElement {
    skills=[{
        id:0,
        name:''
}]
  handleChange(event)
    {
        const skillIndex=Number(event.target.dataset.index);
        const updatedValue=event.target.value;
        this.skills=this.skills.map((skill,index)=>
            index===skillIndex ? {...skill,name:updatedValue} : skill
        );
        this.updateResume();
    }
    updateResume()
    {
        let ev=new CustomEvent('updatedskills',{detail:this.skills});
        this.dispatchEvent(ev);
    }

    addSkill()
    {
        let nextId=this.skills.length;
        this.skills=[...this.skills,{id:nextId,name:''}];
        this.updateResume();
    }


}