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
  loading = false;

  originalProjectNames = {};

  constructor(private activatedRoute: ActivatedRoute, private service: ServiceService, private router: Router) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params => {
      this.projectName = params.get("projectName")
      this.selectedProject = params.get("projectName")
    })
    this.originalProjectNames = this.service.getOriginalProjectNames();

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

  async openPDF(fileName) {
    this.loading = true;
    try {
      await this.service.getModel(fileName).then(res => {
        var link = this.service.generatePDFLink(res.data, fileName);
        window.open(link, "_blank");
      });
    } catch (err) {
      alert("Error getting model, make sure name is correct");
    }
    this.loading = false;
  }
}
