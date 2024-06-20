import { Icon } from '@iconify/react';
import { TextInput, TextInputProps } from '@mantine/core';
import * as React from 'react';

export interface ISerachBar extends TextInputProps {
  searchQuery: string | string[] | null;
  onSearch?: () => void;
}

const SearchBar: React.FC<ISerachBar> = ({
  placeholder,
  value,
  onChange,
  searchQuery,
  onSearch,
  ...rest
}) => {
  const isFirstTimeSearchQuery = React.useRef(0);

  // run onSearch function when searchQuery changes
  React.useEffect(() => {
    if (isFirstTimeSearchQuery.current > 1) {
      onSearch?.(); // Call the search function
    } else {
      isFirstTimeSearchQuery.current += 1; // Mark first render as complete
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  return (
    <TextInput
      radius="sm"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      // onKeyDown={(event) => {
      //   if (event.key === 'Enter' && onSearch) {
      //     onSearch();
      //   }
      // }}
      icon={<Icon icon="tabler:search" fontSize={20} />}
      styles={(theme) => ({
        input: {
          paddingLeft: '40px !important',
          backgroundColor: theme.white,
          '::placeholder': {
            fontWeight: 400,
            fontSize: 14,
            color: theme.colors.dark[3],
          },
        },
        icon: {
          color: theme.colors.dark[6],
          marginLeft: 4,
          width: '36px !important',
        },
      })}
      {...rest}
    />
  );
};

export default SearchBar;
