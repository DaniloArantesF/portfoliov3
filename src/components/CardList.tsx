import '@styles/cardList.scss';
import button from '@styles/button.module.css';
import type { CardProps } from './Card/Card';
import Card from './Card/Card';
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
      <div className="cards-container">
        {cards
          .filter((card) => card.project.visibility === 'visible')
          .map((props) => (
            <Card key={props.project.href} project={props.project} />
          ))}
      </div>
    </div>
  );
}

export default CardList;
