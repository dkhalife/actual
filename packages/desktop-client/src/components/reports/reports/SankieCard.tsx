import { AccountEntity, SankieWidget } from 'loot-core/types/models';
import { ReportCard } from '../ReportCard';
import { View } from '../../common/View';
import { ReportCardName } from '../ReportCardName';
import { DateRange } from '../DateRange';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { calculateTimeRange } from '../reportRanges';
import { LoadingIndicator } from '../LoadingIndicator';
import { useResponsive } from '../../responsive/ResponsiveProvider';
import { useReport } from '../useReport';
import { createSpreadsheet as sankieSpreadsheet } from '../spreadsheets/sankie-spreadsheet';
import { SankieGraph } from '../graphs/SankieGraph';

type SankieCardProps = {
  widgetId: string;
  isEditing?: boolean;
  accounts: AccountEntity[];
  meta?: SankieWidget['meta'];
  onMetaChange: (newMeta: SankieWidget['meta']) => void;
  onRemove: () => void;
};

export function SankieCard({
  widgetId,
  isEditing,
  accounts,
  meta = {},
  onMetaChange,
  onRemove,
}: SankieCardProps) {
  const { t } = useTranslation();
  const { isNarrowWidth } = useResponsive();
  const [nameMenuOpen, setNameMenuOpen] = useState(false);
  const [start, end] = calculateTimeRange(meta?.timeFrame);
  const [isCardHovered, setIsCardHovered] = useState(false);
  const onCardHover = useCallback(() => setIsCardHovered(true), []);
  const onCardHoverEnd = useCallback(() => setIsCardHovered(false), []);

  const params = useMemo(
    () =>
      sankieSpreadsheet(
        start,
        end,
        accounts,
        meta?.conditions,
        meta?.conditionsOp,
      ),
    [start, end, accounts, meta?.conditions, meta?.conditionsOp],
  );

  const data = useReport('sankie', params);

  return (
    <ReportCard
      isEditing={isEditing}
      to={`/reports/sankie/${widgetId}`}
      menuItems={[
        {
          name: 'rename',
          text: t('Rename'),
        },
        {
          name: 'remove',
          text: t('Remove'),
        },
      ]}
      onMenuSelect={item => {
        switch (item) {
          case 'rename':
            setNameMenuOpen(true);
            break;

          case 'remove':
            onRemove();
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

        {data ? (
          <SankieGraph
            graphData={data.graphData}
            compact={true}
            showTooltip={!isEditing && !isNarrowWidth}
            style={{ height: 'auto', flex: 1 }}
          />
        ) : (
          <LoadingIndicator />
        )}
      </View>
    </ReportCard>
  );
}
