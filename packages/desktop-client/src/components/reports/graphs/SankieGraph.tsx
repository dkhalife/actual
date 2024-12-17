import { CSSProperties } from 'react';
import { Container } from '../Container';
import { ResponsiveContainer, Sankey } from 'recharts';

type SankieGraphProps = {
  style?: CSSProperties;
  graphData: {
    data: Array<{
      x: string;
      y: number;
      assets: string;
      debt: string;
      change: string;
      date: string;
    }>;
    start: string;
    end: string;
  };
  compact?: boolean;
  showTooltip?: boolean;
};

export function SankieGraph({
  style,
  graphData,
  compact = false,
  showTooltip = true,
}: SankieGraphProps) {
  return (
    <Container
      style={{
        ...style,
        ...(compact && { height: 'auto' }),
      }}
    >
      {(width, height) =>
        graphData && (
          <ResponsiveContainer>
            <div style={{ ...(!compact && { marginTop: '15px' }) }}>
              <Sankey
                width={width}
                height={height}
                data={{
                  nodes: [
                    {
                      name: 'Foo',
                    },
                    {
                      name: 'Bar',
                    },
                    {
                      name: 'Baz',
                    },
                    {
                      name: 'Bat',
                    },
                  ],
                  links: [
                    {
                      source: 0,
                      target: 1,
                      value: 15,
                    },
                    {
                      source: 0,
                      target: 2,
                      value: 70,
                    },
                    {
                      source: 2,
                      target: 3,
                      value: 10,
                    },
                  ],
                }}
              />
            </div>
          </ResponsiveContainer>
        )
      }
    </Container>
  );
}
