import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-classification',
  templateUrl: './classification.component.html',
  styleUrls: ['./classification.component.scss'],
})
export class ClassificationComponent {
  constructor(private snackBar: MatSnackBar) {}
  useFileAsInput: boolean = false;
  input: string = '';

  ngOnInit() {}

  @ViewChild('fileDropRef', { static: false }) fileDropEl!: ElementRef;
  files: any[] = [];

  onFileDropped($event: any[]) {
    this.prepareFilesList($event);
  }

  fileBrowseHandler(event: any) {
    if (event.target != null) {
      if (event.target.files != null) {
        let files = event.target.files;
        this.prepareFilesList(files);
      }
    }
  }

  deleteFile(index: number) {
    if (this.files[index].progress < 100) {
      this.snackBar.open('Upload in progress.', 'Please Wait');
      return;
    }
    this.files.splice(index, 1);
  }

  getUploadSpeed(index: number) {
    let speed = 0;
    if (this.files[index].size < Math.pow(10, 8)) speed = 100;
    if (
      this.files[index].size > Math.pow(10, 8) &&
      this.files[index].size < Math.pow(10, 9)
    )
      speed = 500;
    if (this.files[index].size > Math.pow(10, 9)) speed = 1000;
    return speed;
  }

  uploadFilesSimulator(index: number) {
    setTimeout(() => {
      if (index === this.files.length) {
        return;
      } else {
        const progressInterval = setInterval(() => {
          if (this.files[index].progress === 100) {
            clearInterval(progressInterval);
            this.uploadFilesSimulator(index + 1);
          } else {
            this.files[index].progress += 5;
          }
        }, this.getUploadSpeed(index));
      }
    }, 1000);
  }

  prepareFilesList(files: Array<any>) {
    for (const item of files) {
      item.progress = 0;
      this.files.push(item);
    }
    this.fileDropEl.nativeElement.value = '';
    this.uploadFilesSimulator(0);
  }

  formatBytes(bytes: number, decimals = 2) {
    if (bytes === 0) {
      return '0 Bytes';
    }
    const k = 1024;
    const dm = decimals <= 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }
}
