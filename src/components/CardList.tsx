import cardList from '@styles/cardList.scss';
import button from '@styles/button.module.css';
import type { CardProps } from './Card';
import Card from './Card';
import { useMemo, useState } from 'react';


interface Props {
  viewAll?: string;
  name: string;
  cards: CardProps[];
}

function CardList({ viewAll, name, cards }: Props) {
  const categories = useMemo(() => new Set(cards.map((c) => c.type)), [cards]);
  const [enabledCategories, setEnabledCategories] = useState([...categories]);

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
      <div className="cards-filters">
        {Array.from(categories).map((category) => (
          <label
            key={category}
            className={`checkbox-label ${
              enabledCategories.includes(category) ? 'checked' : ''
            }`}
          >
            <input
              type="checkbox"
              checked={enabledCategories.includes(category)}
              onChange={() => {
                let newCategories = [...enabledCategories];
                if (enabledCategories.includes(category)) {
                  newCategories.splice(enabledCategories.indexOf(category), 1);
                } else {
                  newCategories.push(category);
                }
                setEnabledCategories(newCategories);
              }}
            />
            {category}
          </label>
        ))}
      </div>
      <div className="cards-container">
        {cards
          .filter(
            (card) =>
              card.visibility === 'visible' &&
              enabledCategories.includes(card.type),
          )
          .map((props) => (
            <Card key={props.href} {...props} />
          ))}
      </div>
    </div>
  );
}

export default CardList;
