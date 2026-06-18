// src/modules/IpAddress/types/ip.types.ts

// Тип для одного IP-адреса (соответствует данным из API)
export interface IpAddress {
  id: number;
  ip: string;
  subnet_mask?: string | null;
  device_type?: string | null;
  switch?: string | null;
  switch_port?: string | null;
  network_segment?: string | null;
  description?: string | null;
}

// Тип для создания/обновления (без id)
export type IpAddressInput = Omit<IpAddress, 'id'>;

// Тип для конфига сортировки
export interface SortConfig {
  key: keyof IpAddress | 'ip'; // 'ip' есть в интерфейсе, но для безопасности указываем
  direction: 'ascending' | 'descending';
}

// Пропсы компонента IpTable
export interface IpTableProps {
  data: IpAddress[];
  sortConfig: SortConfig;
  onSort: (key: keyof IpAddress) => void;
  selectedRowKeys: React.Key[];
  onSelectionChange: (keys: React.Key[], rows: IpAddress[]) => void;
}

// Пропсы IpModal
export interface IpModalProps {
  visible: boolean;
  currentIp: IpAddress | null;
  onCancel: () => void;
  onSuccess: () => void;
}

// Пропсы IpHeader
export interface IpHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onAddNew: () => void;
  selectedRow: IpAddress | null;
  onEdit: (ip: IpAddress) => void;
  onDelete: () => void;
}

// src/modules/IpAddress/types/ip.types.ts
// Добавить в конец файла:

export interface IpTableProps {
  data: IpAddress[];
  sortConfig: SortConfig;
  onSort: (key: keyof IpAddress) => void;
  selectedRowKeys: React.Key[];
  onSelectionChange: (keys: React.Key[], rows: IpAddress[]) => void;
  currentPage?: number;
  pageSize?: number;
  total?: number;
  onPaginationChange?: (page: number, pageSize: number) => void;
}