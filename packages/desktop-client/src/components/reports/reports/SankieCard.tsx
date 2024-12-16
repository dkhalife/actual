import { SankieWidget } from 'loot-core/types/models';
import { ReportCard } from '../ReportCard';
import { View } from '../../common/View';
import { ReportCardName } from '../ReportCardName';
import { DateRange } from '../DateRange';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { calculateTimeRange } from '../reportRanges';

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
  const { t } = useTranslation();
  const [nameMenuOpen, setNameMenuOpen] = useState(false);
  const [start, end] = calculateTimeRange(meta?.timeFrame);
  const [isCardHovered, setIsCardHovered] = useState(false);
  const onCardHover = useCallback(() => setIsCardHovered(true), []);
  const onCardHoverEnd = useCallback(() => setIsCardHovered(false), []);

  return (
    <ReportCard
      isEditing={isEditing}
      to={`/reports/sankie/${widgetId}`}
      menuItems={[
        {
          name: 'rename',
          text: t('Rename'),
        },
      ]}
      onMenuSelect={item => {
        switch (item) {
          case 'rename':
            break;

          default:
            throw new Error(`Unrecognized selection ${item}`);
        }
      }}
    >
      <View
        style={{ flex: 1 }}
        onPointerEnter={onCardHover}
        onPointerLeave={onCardHoverEnd}
      >
        <View style={{ flexDirection: 'row', padding: 20 }}>
          <View style={{ flex: 1 }}>
            <ReportCardName
              name={meta?.name || t('Sankie')}
              isEditing={nameMenuOpen}
              onChange={newName => {
                onMetaChange({
                  ...meta,
                  name: newName,
                });
                setNameMenuOpen(false);
              }}
              onClose={() => setNameMenuOpen(false)}
            />
            <DateRange start={start} end={end} />
          </View>
        </View>
      </View>
    </ReportCard>
  );
}
