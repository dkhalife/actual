import { SankieWidget } from 'loot-core/types/models';

type SankieCardProps = {
  widgetId: string;
  isEditing?: boolean;
  meta?: SankieWidget['meta'];
  onMetaChange: (newMeta: SankieWidget['meta']) => void;
  onRemove: () => void;
};

export function SankieCard({
  widgetId,
  isEditing,
  meta = {},
  onMetaChange,
  onRemove,
}: SankieCardProps) {
  return <div>Hello world</div>;
}
