import { ISchema } from "src/bi-formular-engine/src/public-api";
import { card_panel, label_Input, label_Input_Date_ISO } from "../schema-utils";

export const DEMO_2: ISchema = {
    type: 'panel',
    label: 'Demo Formular 2',
    children: [
        {
            type: 'label',
            label: 'Test'
        },
        card_panel('Test-Panel 2', '',
            [
                ...label_Input('Test-1', 'test-1', 20),
                ...label_Input_Date_ISO('Datum', 'date')
            ]),
            
    ],
}

