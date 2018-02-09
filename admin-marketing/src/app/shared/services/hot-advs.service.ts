import { Injectable } from '@angular/core';

import { api } from '../utils/api';

@Injectable()
export class HotAdvsService {

	private urlHotAdv = `${api.hot_adv}`;

  	constructor() { }

}
