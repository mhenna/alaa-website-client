import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as mime from 'mime-types';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {

  projectNames = [];
  originalProjectNames = {};
  constructor(private http: HttpClient) { }

  // addModel(name, project, model): Promise<any> {
  //   return new Promise((resolve, reject) => {
  //     const reqHeaders: HttpHeaders = new HttpHeaders();
  //     reqHeaders.append('Content-Type', 'application/json');
  //     reqHeaders.append('Access-Control-Allow-Origin', '*');
  //     this.http.post("http://localhost:3300/addModel",
  //       {
  //         "name": name,
  //         "project": project,
  //         "model": model
  //       }
  //     ).subscribe((data) => resolve(data), err => reject(err));
  //   })
  // }

  addModel(name, project, model): Observable<string> {
    return Observable.create(observer => {
      var data = new FormData();
      data.append("name", name);
      data.append("project", project);
      data.append("model", model);
      const ext = '.' + mime.extension(mime.lookup(model.name));
      // const ext = ''
      data.append('extension', ext);
      const xhr = new XMLHttpRequest();
      xhr.open('POST',  'http://localhost:3300/addModel');
      xhr.onload = () => {
        observer.next(xhr.status);
        observer.complete();
      };
      xhr.send(data);
    })
  }

  editModel(name, model): Observable<string> {
    return Observable.create(observer => {
      var data = new FormData();
      data.append("name", name);
      data.append("model", model);
      const ext = '.' + mime.extension(mime.lookup(model.name));
      // const ext = ''
      data.append('extension', ext);
      const xhr = new XMLHttpRequest();
      xhr.open('PUT',  'http://localhost:3300/editModel');
      xhr.onload = () => {
        observer.next(xhr.status);
        observer.complete();
      };
      xhr.send(data);
    })
  }

  getModel(name): Promise<any> {
    return new Promise((resolve, reject) => {
      const reqHeaders: HttpHeaders = new HttpHeaders();
      reqHeaders.append('Content-Type', 'application/json');
      reqHeaders.append('Access-Control-Allow-Origin', '*');

      this.http.get(`http://localhost:3300/getFile?name=${name}`)
        .subscribe((data) => resolve(data), err => reject(err));
    })
  }

  getModelByProject(projectName): Promise<any> {
    return new Promise((resolve, reject) => {
      const reqHeaders: HttpHeaders = new HttpHeaders();
      reqHeaders.append('Content-Type', 'application/json');
      reqHeaders.append('Access-Control-Allow-Origin', '*');

      this.http.get(`http://localhost:3300/getModelByProject?projectName=${projectName}`)
        .subscribe((data) => resolve(data), err => reject(err));
    })
  }

  getModels(): Promise<any> {
    return new Promise((resolve, reject) => {
      const reqHeaders: HttpHeaders = new HttpHeaders();
      reqHeaders.append('Content-Type', 'application/json');
      reqHeaders.append('Access-Control-Allow-Origin', '*');

      this.http.get(`http://localhost:3300/getModels`)
        .subscribe((data) => resolve(data), err => reject(err));
    })
  }

  deleteModel(name): Promise<any> {
    return new Promise((resolve, reject) => {
      const reqHeaders: HttpHeaders = new HttpHeaders();
      reqHeaders.append('Content-Type', 'application/json');
      reqHeaders.append('Access-Control-Allow-Origin', '*');

      this.http.delete(`http://localhost:3300/deleteModel?name=${name}`)
        .subscribe((data) => resolve(data), err => reject(err));
    })
  }

  setProjectNames(projectNames) {
    this.projectNames = projectNames;
  }

  setOriginalProjectNames(originalProjectNames) {
    this.originalProjectNames = originalProjectNames;
  }

  getProjectNames() {
    return this.projectNames;
  }

  getOriginalProjectNames() {
    return this.originalProjectNames;
  }

  generatePDFLink(model, name) {
    var blobData = this.convertBase64ToBlobData(model)
    if (window.navigator && window.navigator.msSaveOrOpenBlob) { //IE
      window.navigator.msSaveOrOpenBlob(blobData, name);
    } else { // chrome
      const blob = new Blob([blobData], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      var pdfLink = url;
      link.download = name;
      return pdfLink;
    }
  }

  convertBase64ToBlobData(base64Data: string, contentType: string = 'application/pdf', sliceSize = 512) {
    const byteCharacters = atob(base64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);

      byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }
}
