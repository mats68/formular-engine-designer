import { ISchema } from "src/app/components/bi-formular-engine/src/public-api";

export const Button_1: ISchema = {
    type: 'button',
    label: 'Simple Button',
    onClick() {
        alert('Hello World!')
    }    
}

