"use client";

import React, { useState, useEffect } from "react";
import { 
  AppShell, 
  Burger, 
  Group, 
  UnstyledButton, 
  Text, 
  Avatar, 
  Menu, 
  ActionIcon, 
  Stack, 
  Tooltip, 
  useMantineColorScheme, 
  useComputedColorScheme,
  Image,
  Box // Added missing Box primitive import
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { 
  IconLayoutDashboard, 
  IconReceipt2, 
  IconBriefcase, 
  IconShoppingCart, 
  IconReportAnalytics, 
  IconSettings, 
  IconSun,
  IconMoon,
  IconChevronLeft,
  IconUsers,
  IconChevronRight,
  IconBuilding
} from "@tabler/icons-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { link } from "fs";

const navLinks = [
  { label: "Sales", href: "/menu/sales", icon: IconReceipt2 },
  { label: "Project Management", href: "/menu/project-management", icon: IconBriefcase },
  { label: "Purchase", href: "/menu/purchase", icon: IconShoppingCart },
  { label: "Reports", href: "/menu/reports", icon: IconReportAnalytics },
  { label: "Stakeholders", href: "/menu/stakeholders", icon: IconUsers },
  { label: "Inventory", href: "/menu/inventory", icon: IconShoppingCart },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  // Handles mobile drawer overlay panel toggle
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
  
  // NEW: Handles desktop sidebar minimization state (defaults to expanded/false)
  const [desktopCollapsed, { toggle: toggleDesktop }] = useDisclosure(false);
  
  const pathname = usePathname();
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme("light", { getInitialValueInEffect: true });

  // INTEGRATED FEATURE: Track client-side DOM mounting to completely eliminate hard-refresh hydration errors
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <AppShell
      header={{ height: 100 }}
      navbar={{ 
        // Dynamic conditional sizing based on collapse toggle position
        width: desktopCollapsed ? 80 : 260, 
        breakpoint: "sm", 
        collapsed: { mobile: !mobileOpened, desktop: false } 
      }}
      padding="md"
      style={{ transition: "all 200ms ease" }} // Smooth transition animation layout snap
    >
      {/* --- HEADER --- */}
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Group>
            <Burger opened={mobileOpened} onClick={toggleMobile} hiddenFrom="sm" size="sm" />
            <UnstyledButton component={Link} href="/menu">
              {/* Group wrapper keeps the icon and text aligned */}
              <Group gap="xs" align="center">
                <Image src="/AlMahrooqi.png" alt="Al Mahrooqi Logo" w={90} h={90} fit="contain"/>
                <Text fw={800} size="xl" c="brandOrange">
                  Al Mahrooqi International LLC
                </Text>
              </Group>
            </UnstyledButton>
          </Group>

          <Group gap="sm">
            {/* INTEGRATED FIX: Handles variable checks and mounting wrappers perfectly without code duplication */}
            <ActionIcon 
              variant="default" 
              size="lg" 
              radius="md" 
              onClick={() => setColorScheme(computedColorScheme === "light" ? "dark" : "light")}
              aria-label="Toggle theme color scheme"
            >
              {!mounted ? (
                <div style={{ width: 20, height: 20 }} />
              ) : computedColorScheme === "light" ? (
                <IconMoon size={20} stroke={1.5} />
              ) : (
                <IconSun size={20} stroke={1.5} />
              )}
            </ActionIcon>

            <Menu shadow="md" width={200} position="bottom-end">
              <Menu.Target>
                <UnstyledButton>
                  <Group gap="xs">
                    <Avatar radius="xl" color="brandOrange" name="John Doe" />
                    <Text size="sm" fw={500} visibleFrom="sm">John Doe</Text>
                  </Group>
                </UnstyledButton>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Label>Application</Menu.Label>
                <Menu.Item leftSection={<IconSettings size={14} />}>Settings</Menu.Item>
                <Menu.Divider />
                <Menu.Item component={Link} href="/login" color="red">Log out</Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Group>
        </Group>
      </AppShell.Header>

      {/* --- SIDEBAR PANEL --- */}
      <AppShell.Navbar p="md" style={{ transition: "width 200ms ease", overflow: "hidden" }}>
        <Stack gap="xs" h="100%" justify="space-between">
          <Stack gap="xs">
            {/* Dashboard Home Link */}
            <Tooltip label="Dashboard Main" position="right" disabled={!desktopCollapsed} withArrow>
              <UnstyledButton
                component={Link}
                href="/menu"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "10px 14px",
                  borderRadius: "8px",
                  backgroundColor: pathname === "/menu" ? "var(--mantine-color-brandOrange-light)" : "transparent",
                  color: pathname === "/menu" ? "var(--mantine-color-brandOrange-6)" : "var(--mantine-color-text)",
                }}
              >
                <IconLayoutDashboard size={20} stroke={1.5} style={{ minWidth: 20 }} />
                {!desktopCollapsed && <Text size="sm" fw={500}>Dashboard Main</Text>}
              </UnstyledButton>
            </Tooltip>

            <hr style={{ border: "none", borderTop: "1px solid var(--mantine-color-default-border)", margin: "10px 0" }} />

            {/* Dynamic Module Nav buttons */}
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname.startsWith(link.href);
              return (
                <Tooltip key={link.href} label={link.label} position="right" disabled={!desktopCollapsed} withArrow>
                  <UnstyledButton
                    component={Link}
                    href={link.href}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      padding: "10px 14px",
                      borderRadius: "8px",
                      backgroundColor: isActive ? "var(--mantine-color-brandOrange-light)" : "transparent",
                      color: isActive ? "var(--mantine-color-brandOrange-6)" : "var(--mantine-color-text)",
                    }}
                  >
                    <Icon size={20} stroke={1.5} style={{ minWidth: 20 }} />
                    {!desktopCollapsed && <Text size="sm" fw={500} style={{ whiteSpace: "nowrap" }}>{link.label}</Text>}
                  </UnstyledButton>
                </Tooltip>
              );
            })}
          </Stack>

          {/* NEW: Collapsible Command Action Button located at the bottom of Navbar */}
          <UnstyledButton
            onClick={toggleDesktop}
            visibleFrom="sm" // Hidden on mobile views where burger takes precedence
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: desktopCollapsed ? "center" : "flex-start",
              gap: "12px",
              padding: "10px 14px",
              borderRadius: "8px",
              border: "1px solid var(--mantine-color-default-border)",
              backgroundColor: "var(--mantine-color-default)",
              cursor: "pointer"
            }}
          >
            {desktopCollapsed ? (
              <IconChevronRight size={20} stroke={1.5} />
            ) : (
              <Group gap="xs" wrap="nowrap">
                <IconChevronLeft size={20} stroke={1.5} />
                <Text size="xs" fw={600} c="dimmed" tt="uppercase">Collapse Menu</Text>
              </Group>
            )}
          </UnstyledButton>
        </Stack>
      </AppShell.Navbar>

      {/* --- CONTENT WORKSPACE --- */}
      <AppShell.Main bg="var(--mantine-color-body)">
        {children}
      </AppShell.Main>
    </AppShell>
  );
}