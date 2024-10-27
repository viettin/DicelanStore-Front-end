import { Component, CUSTOM_ELEMENTS_SCHEMA, ViewChild } from '@angular/core';
import { SharedCommonModule } from '../../shared/shared.module';
import { Sidebar } from 'primeng/sidebar';
import { Router, RouterOutlet } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { Store } from '@ngrx/store';
import { getUser, isLoggedIn } from '../../store/selectors/auth.selectors';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [SharedCommonModule, RouterOutlet],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AdminComponent {
  items: MenuItem[] | undefined;
  user: any;
  @ViewChild('sidebarRef') sidebarRef!: Sidebar;

  constructor(private store: Store, private router: Router) {}
  ngOnInit() {
    this.store.select(getUser).subscribe((user) => (this.user = user));
    this.items = [
      {
        separator: true,
      },
      {
        label: 'Quản Trị',
        visible: this.user.role === 'Admin',
        items: [
          {
            label: 'Quản lý sản phẩm',
            icon: 'pi pi-plus',
            command: () => {
              this.router.navigate(['/admin/product-management']);
            },
          },
        ],
      },
      {
        label: 'Khách Hàng',
        items: [
          {
            label: 'Quản lý đơn hàng',
            icon: 'pi pi-cog',
            command: () => {
              if (this.user.role === 'Admin') {
                this.router.navigate(['/admin/order-management']);
              } else {
                this.router.navigate(['/user/order-management']);
              }
            },
          },
          {
            label: 'Đổi mật khẩu',
            icon: 'pi pi-inbox',
            badge: '2',
          },
          {
            label: 'Logout',
            icon: 'pi pi-sign-out',
            shortcut: '⌘+Q',
          },
        ],
      },
      {
        separator: true,
      },
    ];
  }
  closeCallback(e: any): void {
    this.sidebarRef.close(e);
  }

  sidebarVisible: boolean = true;
}
