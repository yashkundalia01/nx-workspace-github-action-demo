import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'nx-workspace-demo-audit',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './audit.component.html',
  styleUrls: ['./audit.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuditComponent {}
