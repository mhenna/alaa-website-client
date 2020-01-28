import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ServiceService } from '../service/service.service';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.css']
})
export class SideNavComponent implements OnInit {

  @Output() projectNameChange = new EventEmitter();
  projectNames = [];
  visible = false;
  selectedProject = "";
  constructor(private service: ServiceService) { }

  ngOnInit() {
    this.projectNames = this.service.getProjectNames();
  }

  open(): void {
    this.visible = true;
  }

  close(): void {
    this.visible = false;
  }

  handleProjectChange(projectName) {
    this.selectedProject = projectName;
    this.projectNameChange.emit(this.selectedProject);
  }
}
