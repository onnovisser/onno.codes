import React from 'react';
import Text from './text';

Heading.propTypes = {
  ...Text.propTypes,
};

function Heading({ size = 600, weight = 400, as = 'h2', variant = 'display', ...rest }) {
  return <Text size={size} weight={weight} as={as} variant={variant} {...rest} />;
}

export default Heading;
