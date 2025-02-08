import { Button, ButtonProps } from '@mantine/core';
import { IconBrandTwilio } from '@tabler/icons-react';

export function TwitterButton(props: ButtonProps & React.ComponentPropsWithoutRef<'button'>) {
  return (
    <Button leftSection={<IconBrandTwilio />} variant="default" {...props} />
  );
}