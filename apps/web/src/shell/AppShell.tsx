import { Button } from "@forgeai/ui";
import { AppShell as MantineAppShell, Badge, Group, NavLink, Text, Title } from "@mantine/core";

export function AppShell() {
  return (
    <MantineAppShell header={{ height: 64 }} navbar={{ width: 260, breakpoint: "sm" }} padding="lg">
      <MantineAppShell.Header>
        <Group h="100%" px="lg" justify="space-between">
          <Group gap="sm">
            <Title order={3}>ForgeAI</Title>
            <Badge variant="light">Phase 0</Badge>
          </Group>
          <Button>Workspace</Button>
        </Group>
      </MantineAppShell.Header>

      <MantineAppShell.Navbar p="md">
        <NavLink label="AI Chat" active />
        <NavLink label="Agents" />
        <NavLink label="Architecture" />
        <NavLink label="Workflows" />
        <NavLink label="Projects" />
      </MantineAppShell.Navbar>

      <MantineAppShell.Main>
        <Title order={1}>AI Powered Software Engineering Platform</Title>
        <Text mt="md" maw={720}>
          Phase 0 establishes the monorepo, architecture, shared packages, tooling, and deployment
          foundation for ForgeAI.
        </Text>
      </MantineAppShell.Main>
    </MantineAppShell>
  );
}
