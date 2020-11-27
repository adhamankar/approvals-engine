import { InjectionToken } from '@angular/core';

export const IBACKEND_URLS = new InjectionToken<BackendUrl[]>('backend urls configuration');

export class BackendUrl {
  constructor(public key: string, public value: string, public title?: string) {}
}
