import { MantineProvider } from "@mantine/core";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { AppShell } from "./AppShell";

describe("AppShell", () => {
  it("renders the ForgeAI shell", () => {
    render(
      <MantineProvider>
        <AppShell />
      </MantineProvider>
    );

    expect(screen.getByText("ForgeAI")).toBeInTheDocument();
  });
});
