import { LightningElement } from 'lwc';

export default class EducationDetaileComponent extends LightningElement {
    education = [
        {
            id: 0,
            degree: '',
            year: '',
            institution: ''
        }
    ];

    handleChange(event) {
        const index = Number(event.target.dataset.index);
        const field = event.target.dataset.field;
        const value = event.target.value;

        this.education = this.education.map((item, itemIndex) =>
            itemIndex === index ? { ...item, [field]: value } : item
        );
        this.updateResume();
    }

    updateResume() {
        this.dispatchEvent(
            new CustomEvent('updateedu', {
                detail: this.education
            })
        );
    }

    addEducation() {
        const nextId = this.education.length;
        this.education = [
            ...this.education,
            {
                id: nextId,
                degree: '',
                year: '',
                institution: ''
            }
        ];
        this.updateResume();
    }
}