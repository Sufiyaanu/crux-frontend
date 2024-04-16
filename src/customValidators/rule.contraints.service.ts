import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { SchemaDetails, SchemaPatternAttr } from 'src/models/common-interfaces';

export function checkConstraints(schemaData: SchemaDetails): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {

        const value = control.value;
        const formArray = control.parent;
        if (!value || !formArray) {
            return null;
        }

        const patternDetails = schemaData.patternschema.filter((pattern: SchemaPatternAttr) => pattern.attr == formArray.value.attrname)[0]

        if (value < 0) {
            return { ConstraintsError: true, message: 'Value is negative' }
        }
        else if (patternDetails?.valmax && value > patternDetails?.valmax!) {
            return { ConstraintsError: true, message: `Value is greater then ${patternDetails?.valmax}` }
        } else if (patternDetails?.valmin && value < patternDetails?.valmin!) {
            return { ConstraintsError: true, message: `Value is less then ${patternDetails?.valmin}` }
        } else if (patternDetails?.lenmax && value.length > patternDetails?.lenmax!) {
            return { ConstraintsError: true, message: `length is greater then ${patternDetails?.lenmax}` }
        } else if (patternDetails?.lenmin && value.length < patternDetails?.lenmin!) {
            return { ConstraintsError: true, message: `length is less then ${patternDetails?.lenmin}` }
        }


        return null;
    }
}