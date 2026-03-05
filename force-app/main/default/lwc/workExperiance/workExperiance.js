import { LightningElement } from 'lwc';

export default class WorkExperiance extends LightningElement {
    workExperience = [
        {
            id: 0,
            jobTitle: '',
            companyName: '',
            location: '',
            startDate: '',
            endDate: '',
            responsibilities: ''
        }
    ];

    handleChange(event) {
        const index = Number(event.target.dataset.index);
        const field = event.target.dataset.field;
        const value = event.target.value;

        this.workExperience = this.workExperience.map((item, itemIndex) =>
            itemIndex === index ? { ...item, [field]: value } : item
        );
        this.updateResume();
    }

    addWorkExperience() {
        const nextId = this.workExperience.length;
        this.workExperience = [
            ...this.workExperience,
            {
                id: nextId,
                jobTitle: '',
                companyName: '',
                location: '',
                startDate: '',
                endDate: '',
                responsibilities: ''
            }
        ];
        this.updateResume();
    }

    updateResume() {
        this.dispatchEvent(
            new CustomEvent('updatework', {
                detail: this.workExperience
            })
        );
    }
}