import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, Input, ViewChild } from '@angular/core';
import { IMemory, MemoryService } from '../services/memory.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, map } from 'rxjs';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-memory-table',
  templateUrl: './memory-table.component.html',
  styleUrls: ['./memory-table.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class MemoryTableComponent {
  dataSource!: MatTableDataSource<IMemory>
  memories!: IMemory[]
  columnsToDisplay = ['input', 'output', 'field_of_activity', 'actions'];
  expandedElement!: IMemory;
  clicked = false;

  @ViewChild(MatPaginator, {static: false}) paginator!: MatPaginator
  @ViewChild(MatSort, {static: false}) sort!: MatSort

  constructor(private memoryService: MemoryService, private dialog: MatDialog){
    this.memoryService.getMemory().subscribe(data=>{this.memories=data as IMemory[]
      this.dataSource = new MatTableDataSource(data as IMemory[])
      this.dataSource.paginator=this.paginator
      this.dataSource.sort=this.sort
    })
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.columnsToDisplay, event.previousIndex, event.currentIndex);
  }

  delete(element: IMemory){
    if(element.id){
      if(confirm("Are you sure you want to delete this classification?")) {
        this.memoryService.deleteMemory(element.id).subscribe(data=>this.dataSource.data=data as IMemory[])
      }
    }
  }
}
