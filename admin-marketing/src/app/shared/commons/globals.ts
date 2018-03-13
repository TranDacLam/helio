import { Injectable } from '@angular/core';
import { User } from './../class/user';

@Injectable()
export class Globals {
    user_current: User; // user current
}