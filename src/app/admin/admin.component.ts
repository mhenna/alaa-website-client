import { Component, OnInit } from '@angular/core';
import { ServiceService } from '../service/service.service';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators
} from '@angular/forms';
import { error } from 'util';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  fileToUpload: File = null;
  valid = false;
  addFileForm = new FormGroup({
    name: new FormControl('', [
      Validators.required
    ]),
    project: new FormControl('', [
      Validators.required
    ])
  })

  editFileForm = new FormGroup({
    name: new FormControl('', [
      Validators.required
    ])
  })

  deleteFileForm = new FormGroup({
    name: new FormControl('', [
      Validators.required
    ])
  })

  getFileForm = new FormGroup({
    name: new FormControl('', [
      Validators.required
    ])
  })

  constructor(private service: ServiceService) { }

  ngOnInit() {
  }

  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
  }

  checkValid() {
    if (this.addFileForm.get('name').value && this.addFileForm.get('project').value)
      this.valid = true;
    console.log(this.valid)
  }
  addModel() {
    const reader = new FileReader();

    reader.readAsDataURL(this.fileToUpload);
    reader.onload = async () => {
      await this.service.addModel(this.addFileForm.get('name').value, this.addFileForm.get('project').value, this.fileToUpload).subscribe(res => {
        alert("Model added")
      }, error => {
        alert(error)
      })
    }
  }

  editModel() {
    const reader = new FileReader();

    reader.readAsDataURL(this.fileToUpload);
    reader.onload = async () => {
      var obj = {
        "name": this.addFileForm.get('name').value,
        "model": reader.result.toString().split(',')[1]
      }

      // var pdfLink = this.generatePDFLink(obj);

      await this.service.editModel(this.addFileForm.get('name').value, "pdfLink").then(res => {
        alert("Model added")
      }, error => {
        alert(error)
      })
    }
  }

  async getModel() {
    try {
      await this.service.getModel(this.getFileForm.get("name").value).then(res => {
        var link = this.generatePDFLink(res.data, this.getFileForm.get("name").value);
        window.open(link, "_blank");
      });
    } catch (err) {
      alert("Error getting model, make sure name is correct");
    }
  }

  async deleteModel() {
    await this.service.deleteModel(this.deleteFileForm.get("name").value).then(res => {
      if (res.data.deletedCount == 0)
        alert("Model does not exist")
      else
        alert("Model deleted")
    }, error => {
      alert(error.message)
    })
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
