import '@styles/cardList.scss';
import button from '@styles/button.module.css';
import type { CardProps } from './Card';
import Card from './Card';
import { useMemo, useState, useCallback } from 'react';

interface Props {
  viewAll?: string;
  name: string;
  cards: CardProps[];
}

const Filter: React.FC<{
  category: 'project' | 'scene' | 'game';
  label: string;
  checked: boolean;
  onChange: () => void;
}> = ({ category, label, checked, onChange }) => {
  return (
    <label
      key={category}
      className={`checkbox-label ${checked ? 'checked' : ''}`}
    >
      <input type="checkbox" checked={checked} onChange={onChange} />
      {label}
    </label>
  );
};

function CardList({ viewAll, name, cards }: Props) {
  const categories = useMemo(
    () => new Set(cards.map((c) => c.type ?? 'project')),
    [cards],
  );
  const [enabledCategories, setEnabledCategories] = useState([...categories]);

  const toggleCategory = useCallback(
    (category: 'project' | 'scene' | 'game') => {
      let newCategories = [...enabledCategories];
      if (enabledCategories.includes(category)) {
        newCategories.splice(enabledCategories.indexOf(category), 1);
      } else {
        newCategories.push(category);
      }
      setEnabledCategories(newCategories);
    },
    [enabledCategories],
  );

  const categoryMap = useMemo(
    () => ({
      project: 'Projects',
      scene: 'Demos',
      game: 'Games',
    }),
    [],
  );

  return (
    <div className="cardlist-container">
      <div
        className={`section-details ${viewAll ? `details--view-all ` : ''} `}
      >
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
          <Filter
            key={category}
            category={category}
            label={categoryMap[category]}
            checked={enabledCategories.includes(category)}
            onChange={() => toggleCategory(category)}
          />
        ))}
      </div>
      <div className="cards-container">
        {cards
          .filter(
            (card) =>
              card.visibility === 'visible' &&
              enabledCategories.includes(card.type ?? 'project'),
          )
          .map((props) => (
            <Card key={props.href} {...props} />
          ))}
      </div>
    </div>
  );
}

export default CardList;
