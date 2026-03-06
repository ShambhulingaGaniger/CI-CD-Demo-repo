import { LightningElement } from 'lwc';

export default class FourthComponent extends LightningElement {
    showCard = false;

    handleClick() {
        this.showCard=!this.showCard;
    }
}