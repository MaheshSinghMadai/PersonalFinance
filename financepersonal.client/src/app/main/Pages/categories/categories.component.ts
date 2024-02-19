import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit{
 
  viewer = 'google';  
  selectedType = 'docx';   
  DemoDoc="https://www.le.ac.uk/oerresources/bdra/html/resources/example.txt"  ;

  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }
  
  openDoc(){
    const documentUrl = 'https://tuiost.edu.np/storage/notice/img-0002310.pdf';
    window.open(documentUrl, '_blank');
  }

}
