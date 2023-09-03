import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'nx-workspace-demo-ag-grid',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ag-grid.component.html',
  styleUrls: ['./ag-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AgGridComponent {}
