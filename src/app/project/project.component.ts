import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ServiceService } from '../service/service.service';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})
export class ProjectComponent implements OnInit {

  projectName: any;
  selectedProject = "";
  projectFiles = [];
  pdfLink: any;

  originalProjectNames = {};

  constructor(private activatedRoute: ActivatedRoute, private service: ServiceService, private router: Router) { }

  async ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params => {
      this.projectName = params.get("projectName")
      this.selectedProject = params.get("projectName")
    })
    this.originalProjectNames = await this.service.getOriginalProjectNames();

    this.populateProjectFiles(this.projectName);
  }

  handleProjectNameChange(projectName) {
    this.selectedProject = projectName;
    this.populateProjectFiles(projectName);
  }

  async populateProjectFiles(projectName) {
    this.projectFiles = [];
    var response = await this.service.getModelByProject(this.originalProjectNames[projectName]);

    var arr = [];
    for (var i = 0; i < response.data.length; i++) {
      var obj = {
        "name": response.data[i].name,
        "model": response.data[i].model
      }
      arr.push(obj);
      if (i % 3 == 0 && i != 0) {
        this.projectFiles.push(arr);
        arr = [];
      }
    }
    if (arr.length > 0)
      this.projectFiles.push(arr)
  }

  downloadModel(model) {
    window.open(model.model, "_blank")
    // var blobData = this.convertBase64ToBlobData(model.model)
    // if (window.navigator && window.navigator.msSaveOrOpenBlob) { //IE
    //   window.navigator.msSaveOrOpenBlob(blobData, model.name);
    // } else { // chrome
    //   const blob = new Blob([blobData], { type: 'application/pdf' });
    //   const url = window.URL.createObjectURL(blob);
    //   const link = document.createElement('a');
    //   link.href = url;
    //   this.pdfLink = url;
    //   link.download = model.name;
    //   window.open(this.pdfLink, "_blank")
    // }
  }

}
