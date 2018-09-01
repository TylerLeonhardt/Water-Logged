/* global fetch */
export default class request {
  static get(url, data) {
    const req = Object.assign({ method: 'GET' }, data);
    return fetch(url, req).then(res => res.json());
  }

  static post(url, data) {
    const req = Object.assign({ method: 'POST' }, data);
    return fetch(url, req).then(res => res.json());
  }
}
