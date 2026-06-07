import { useState } from 'react';
import { Card } from '../../components/ui/Card';

const conversations = [
  { name: 'Sarah K. (Waiter)', lastMessage: 'Table 12 needs another round', time: '2m ago' },
  { name: 'Jordan D. (Manager)', lastMessage: 'Approve overtime for station B', time: '15m ago' },
];

export const ChefMessages = () => {
  const [selected, setSelected] = useState(conversations[0]);

  return (
    <div className="grid grid-cols-3 gap-4 h-full">
      <div className="space-y-2 overflow-y-auto">
        <h3 className="text-headline-sm text-on-surface font-semibold mb-3">Messages</h3>
        {conversations.map((c) => (
          <button key={c.name} onClick={() => setSelected(c)} className={`w-full text-left p-3 rounded-container border transition-colors ${selected.name === c.name ? 'bg-surface-container-low border-primary-container/50' : 'bg-surface border-white/8'}`}>
            <p className="text-body-md text-on-surface font-semibold">{c.name}</p>
            <p className="text-body-md text-on-surface-variant/60 text-sm truncate">{c.lastMessage}</p>
          </button>
        ))}
      </div>
      <Card className="col-span-2 p-4 flex flex-col">
        <div className="border-b border-white/8 pb-3 mb-4">
          <p className="text-headline-sm text-on-surface font-semibold">{selected.name}</p>
          <p className="text-label-caps text-on-surface-variant/60">{selected.time}</p>
        </div>
        <div className="flex-1 space-y-3 overflow-y-auto">
          <div className="flex justify-start"><Card className="p-2 max-w-xs"><p className="text-body-md text-on-surface-variant/80">{selected.lastMessage}</p></Card></div>
        </div>
        <div className="mt-4 flex gap-2">
          <input className="flex-1 bg-surface-container-low border border-outline-variant rounded-ui px-3 py-2 text-body-md text-on-surface" placeholder="Type a message..." />
          <button className="px-4 py-2 bg-primary-container text-on-primary rounded-ui text-label-caps">Send</button>
        </div>
      </Card>
    </div>
  );
};
