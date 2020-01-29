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

  addModel() {
    this.service.addModel(this.addFileForm.get('name').value, this.addFileForm.get('project').value, this.fileToUpload).subscribe(res => {
      alert("Model added")
    }, error => {
      alert(error)
    })
  }

  editModel() {
    console.log(this.fileToUpload.name)
    this.service.editModel(this.editFileForm.get('name').value, this.fileToUpload).subscribe(res => {
      alert("Model edited")
    }, error => {
      alert(error)
    })
  }

  async getModel() {
    try {
      await this.service.getModel(this.getFileForm.get("name").value).then(res => {
        var link = this.service.generatePDFLink(res.data, this.getFileForm.get("name").value);
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
}
