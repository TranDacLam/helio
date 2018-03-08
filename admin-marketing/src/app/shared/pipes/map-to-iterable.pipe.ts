import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'mapToIterable'})
export class MapToIterablePipe implements PipeTransform {
    transform(dict: Object): Array<any> {
        let arr = [];
        for (let key in dict) {
            if (dict.hasOwnProperty(key)) {
                arr.push({key: key, val: dict[key]});
            }
        }
        return arr;
    }
}