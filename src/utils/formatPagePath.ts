export const formatPagePath = (
  collection: string,
  doc: any,  
): string => {
  const { slug } = doc;

  let prefix = '';

  if (collection) {
    switch (collection) {
      case 'pages':
        prefix = '';
        break;
      case 'projects':
        prefix = '/projects';
        break;
      default:
        prefix = `/${collection}`;
    }
  }

  return `${prefix}/${slug}`;
};
