import React, { Fragment } from 'react';
import escapeHTML from 'escape-html';
import { Text } from 'slate';
// import classes from './RichText.module.css';

 
type Children = Leaf[];

type Leaf = {
  type: string;
  value?: {
    url: string;
    alt: string;
  };
  children?: Children;
  url?: string;
  [key: string]: unknown;
};

const serialize = (
  children: Children | undefined,
): (React.ReactElement | null)[] =>
  children?.map((node, i): React.ReactElement | null => {
    if (Text.isText(node)) {
      let text = (
        // <span dangerouslySetInnerHTML={{ __html: escapeHTML(node.text) }} />
        <React.Fragment>{escapeHTML(node.text)}</React.Fragment>
      );

      if (node.bold) {
        text = <strong key={i}>{text}</strong>;
      }

      if (node.code) {
        text = <code key={i}>{text}</code>;
      }

      if (node.italic) {
        text = <em key={i}>{text}</em>;
      }

      if (node.underline) {
        text = (
          <span style={{ textDecoration: 'underline' }} key={i}>
            {text}
          </span>
        );
      }

      if (node.strikethrough) {
        text = (
          <span style={{ textDecoration: 'line-through' }} key={i}>
            {text}
          </span>
        );
      }

      return <Fragment key={i}>{text}</Fragment>;
    }

    if (!node) {
      return null;
    }

    switch (node.type) {
      case 'h1':
        return <h1 key={i}>{serialize(node.children)}</h1>;
      case 'h2':
        return <h2 key={i}>{serialize(node.children)}</h2>;
      case 'h3':
        return <h3 key={i}>{serialize(node.children)}</h3>;
      case 'h4':
        return <h4 key={i}>{serialize(node.children)}</h4>;
      case 'h5':
        return <h5 key={i}>{serialize(node.children)}</h5>;
      case 'h6':
        return <h6 key={i}>{serialize(node.children)}</h6>;
      case 'quote':
        return <blockquote key={i}>{serialize(node.children)}</blockquote>;
      case 'ul':
        return <ul key={i}>{serialize(node.children)}</ul>;
      case 'ol':
        return <ol key={i}>{serialize(node.children)}</ol>;
      case 'li':
        return <li key={i}>{serialize(node.children)}</li>;
      case 'link':
        return (
          <a href={escapeHTML(node.url)} target="_blank" key={i}>
            {serialize(node.children)}
          </a>
        );

      default:
        return <p key={i}>{serialize(node.children)}</p>;
    }
  }) ?? [];

export const richTextToString = (children: Children | undefined): string =>
  children
    ?.map((node): string => {
      if (Text.isText(node)) {
        return node.text;
      }

      if (!node) {
        return '';
      }

      switch (node.type) {
        case 'h1':
        case 'h2':
        case 'h3':
        case 'h4':
        case 'h5':
        case 'h6':
        case 'quote':
        case 'ul':
        case 'ol':
        case 'li':
          return richTextToString(node.children);
        case 'link':
          return node.url ?? '';
        default:
          return richTextToString(node.children);
      }
    })
    ?.join('') ?? '';

export default serialize;
