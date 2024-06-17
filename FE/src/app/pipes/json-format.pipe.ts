 import { Pipe, PipeTransform } from '@angular/core'; 

@Pipe({ 
	name: 'pretty'
}) 

export class JsonFormatPipe implements PipeTransform { 

	transform(val: any) { 
		return JSON.stringify(val, undefined, 4) 
			.replace(/ /g, '') 
			.replace(/\n/g, '<br/>'); 
	} 
}
