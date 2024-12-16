import { useParams } from 'react-router-dom';
import { LoadingIndicator } from '../LoadingIndicator';
import { useWidget } from 'loot-core/client/data-hooks/widget';
import { MobilePageHeader, Page, PageHeader } from '../../Page';
import { MobileBackButton } from '../../mobile/MobileBackButton';
import { EditablePageHeaderTitle } from '../../EditablePageHeaderTitle';
import { t } from 'i18next';
import { useResponsive } from '../../responsive/ResponsiveProvider';
import { useNavigate } from '../../../hooks/useNavigate';
import { send } from 'loot-core/platform/client/fetch';
import { SankieWidget } from 'loot-core/types/models';

export function Sankie() {
  const params = useParams();
  const { data: widget, isLoading } = useWidget<SankieWidget>(
    params.id ?? '',
    'sankie-card',
  );

  if (isLoading) {
    return <LoadingIndicator />;
  }

  return <SankieInner widget={widget} />;
}

type SankieInnerProps = {
  widget?: SankieWidget;
};

function SankieInner({ widget }: SankieInnerProps) {
  const navigate = useNavigate();
  const { isNarrowWidth } = useResponsive();

  const title = widget?.meta?.name || t('Sankie');

  const onSaveWidgetName = async (newName: string) => {
    if (!widget) {
      throw new Error('No widget that could be saved.');
    }

    const name = newName || t('Sankie');
    await send('dashboard-update-widget', {
      id: widget.id,
      meta: {
        ...(widget.meta ?? {}),
        name,
      },
    });
  };

  return (
    <Page
      header={
        isNarrowWidth ? (
          <MobilePageHeader
            title={title}
            leftContent={
              <MobileBackButton onPress={() => navigate('/reports')} />
            }
          />
        ) : (
          <PageHeader
            title={
              widget ? (
                <EditablePageHeaderTitle
                  title={title}
                  onSave={onSaveWidgetName}
                />
              ) : (
                title
              )
            }
          />
        )
      }
      padding={0}
    >
      <div>Hello world</div>
    </Page>
  );
}
