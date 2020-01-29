import { Component, OnInit } from '@angular/core';
import { ServiceService } from '../service/service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.css']
})
export class PortfolioComponent implements OnInit {

  models: any;
  projects = new Set();
  projectNames = [];
  originalProjectNames = {};
  constructor(private service: ServiceService, private router: Router) { }

  async ngOnInit() {
    this.models = await this.service.getModels();

    this.models.data.map(model => {
      this.projects.add(model.project)
    })

    var p_names = Array.from(this.projects);
    p_names = p_names.sort();
    for (var i = 0; i < p_names.length; i++) {
      var obj = {
        "name": p_names[i].toString().split(" ")[1],
        "date": p_names[i].toString().split(" ")[2]
      }

      this.originalProjectNames[p_names[i].toString().split(" ")[1]] = p_names[i];

      this.projectNames.push(obj)
      this.service.setProjectNames(this.projectNames);
      this.service.setOriginalProjectNames(this.originalProjectNames);
    }
  }

  navigateToHome() {
    this.router.navigate([''])
  }
}
