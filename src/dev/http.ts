import { Observable, Subscriber } from 'rxjs';

export type RequestMethod = 'GET' | 'POST';
import * as $ from 'jquery';

export interface IHttpOptions {
  url?: string;
  headers?: Object;
  body?: Object;
  method?: RequestMethod
}

export function Http(opts: IHttpOptions) {
  return new Observable((subscriber: Subscriber<any>) => {
    $.ajax({
      url: opts.url,
      data: JSON.stringify(opts.body),
      type: opts.method,
      dataType: 'json',
      beforeSend: function (arg) {
        if (opts.headers) {
          for (let header in opts.headers) {
            arg.setRequestHeader(header, opts.headers[header]);
          }
        }
      }
    }).then((res) => {
      subscriber.next(res);
    });
  });
}
