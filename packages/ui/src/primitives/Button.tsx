import { Button as MantineButton, type ButtonProps as MantineButtonProps } from "@mantine/core";

export type ButtonProps = MantineButtonProps;

export function Button(props: ButtonProps) {
  return <MantineButton radius="sm" {...props} />;
}
