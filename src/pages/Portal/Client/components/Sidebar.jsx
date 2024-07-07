import { Box, Text } from "@chakra-ui/react";

const NavItem = ({ children, isActive, ...rest }) => (
    <Box
        cursor="pointer"
        my={1}
        py={2}
        px={4}
        bg={isActive ? 'blue.500' : 'transparent'}
        color={isActive ? 'white' : 'gray.500'}
        borderRadius="md"
        _hover={{
            bg: isActive ? 'blue.600' : 'gray.200',
            color: isActive ? 'white' : 'black',
        }}
        {...rest}
    >
        <Text fontSize="md">{children}</Text>
    </Box>
);

const Sidebar = ({ apps, portalName, settings, onClose, navigate, ref }) => (
    <Box
        ref={ref}
        zIndex={99999}
        w="240px"
        h="100%"
        bg={settings?.sidebarBgColor || 'gray.100'}
        color={settings?.sidebarTextColor || 'gray.800'}
        p={4}
    >
        <Text>{settings?.brandName}</Text>
        {apps.map((app) => (
            <NavItem
                key={app.id}
                isActive={app?.name.toLowerCase() === portalName?.toLowerCase()}
                onClick={() => {
                    onClose();
                    navigate(`/portal/${app.name}`);
                }}
            >
                {app.name}
            </NavItem>
        ))}
    </Box>
);
export default Sidebar;