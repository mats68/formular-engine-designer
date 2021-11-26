import { ISchema } from "src/app/components/bi-formular-engine/src/public-api";
import { card_hint_panel, card_panel, label_Input, schemaClassLayout } from "./schema-utils";

export const DEMO_1: ISchema = {
    type: 'panel',
    label: 'Demo Formular 1',
    classLayout: 'w-full',
    children: [
        card_panel('Test-Panel 1', '',
            [
                ...label_Input('Test-1', 'test-1', 20),
                ...label_Input('Test-2', 'test-2', 50)
            ]),

    ],
}

