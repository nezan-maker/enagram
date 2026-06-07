import { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useAuthStore } from '../../store/auth.store';
import { menuApi } from '../../api/menu.api';

export const MenuManagement = () => {
  const { restaurantId } = useAuthStore();
  const [menus, setMenus] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newMenuName, setNewMenuName] = useState('');

  const fetchMenus = () => {
    if (!restaurantId) return;
    menuApi.list(restaurantId).then((res) => {
      setMenus(res.data?.data || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  useEffect(() => { fetchMenus(); }, [restaurantId]);

  const createMenu = async () => {
    if (!newMenuName.trim() || !restaurantId) return;
    await menuApi.create(restaurantId, { name: newMenuName }).catch(() => {});
    setNewMenuName('');
    fetchMenus();
  };

  const deleteMenu = async (menuId: string) => {
    if (!restaurantId) return;
    await menuApi.delete(restaurantId, menuId).catch(() => {});
    fetchMenus();
  };

  if (loading) return <div className="p-6 text-on-surface">Loading menus...</div>;

  return (
    <div className="space-y-6 p-6">
      <h2 className="text-headline-md text-on-surface font-bold">Menu Management</h2>

      <Card className="p-5">
        <h3 className="text-headline-sm text-on-surface font-semibold mb-3">Create Menu</h3>
        <div className="flex gap-3">
          <input
            className="flex-1 px-3 py-2 bg-surface-container rounded-lg text-on-surface border border-outline"
            placeholder="Menu name"
            value={newMenuName}
            onChange={(e) => setNewMenuName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && createMenu()}
          />
          <Button onClick={createMenu} disabled={!newMenuName.trim()}>Create</Button>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {menus.length === 0 && <p className="text-on-surface-variant col-span-full">No menus yet</p>}
        {menus.map((menu: any) => (
          <Card key={menu._id} className="p-5">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-semibold text-on-surface">{menu.name}</p>
                <p className="text-label-sm text-on-surface-variant">{menu.description || 'No description'}</p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="secondary" onClick={() => deleteMenu(menu._id)}>Delete</Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
