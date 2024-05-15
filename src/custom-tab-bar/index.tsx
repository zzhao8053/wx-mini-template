import { Tabbar } from '@nutui/nutui-react-taro';
import { Category, Find, User } from '@nutui/icons-react-taro';

export default function CustomTabBar() {
  return (
    <Tabbar fixed safeArea>
      <Tabbar.Item title="首页" icon={<Category size={18} />} />
      <Tabbar.Item title="发现" icon={<Find size={18} />} />
      <Tabbar.Item title="我的" icon={<User size={18} />} />
    </Tabbar>
  );
}
