import { useMemo } from 'react';
import cardList from '@styles/cardList.scss';
import button from '@styles/button.module.css';
import type { CardProps } from './Card';
import Card from './Card';

interface Props {
  viewAll?: string;
  name: string;
  cards: CardProps[];
}

function CardList({ viewAll, name, cards }: Props) {
  const devMode = useMemo(
    () => window.location.search === '?dev' || import.meta.env.DEV,
    [],
  );

  return (
    <div className="cardlist-container">
      <div className="section-details">
        <h2>{name}</h2>
        {viewAll && (
          <a
            className={`${button.button} ${button.outlined} ${button.border}`}
            href={viewAll}
            aria-label={`View all projects`}
          >
            View All
          </a>
        )}
      </div>
      <div className="cards-container">
        {cards
          .filter((card) => devMode || card.visibility === 'visible')
          .map((props) => (
            <Card key={props.href} {...props} />
          ))}
      </div>
    </div>
  );
}

export default CardList;
