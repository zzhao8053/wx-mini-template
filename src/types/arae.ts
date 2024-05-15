export interface IAreaItem {
  id: number;
  name: string;
  label: string;
  parentId: number | null;
  level: number;
}

export interface IAreaTreeItem extends IAreaItem {
  children: IAreaTreeItem[];
}

export interface IAreaTree extends Array<IAreaTreeItem> {}
