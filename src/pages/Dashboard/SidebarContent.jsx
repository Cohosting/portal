import React from 'react';
import { Avatar, Box, Divider, Text } from '@chakra-ui/react';
import { useLocation, useNavigate } from 'react-router-dom';

import CommonBoxContainer from '../../components/CommonBoxContainer';
import NavItem from '../../components/NavItem';

import { navItemList } from './../../utils/constant';

// SidebarContent component displays the sidebar with user info, account type message, and navigation items.
const SidebarContent = ({ user, portalTeamMemberData, portal }) => {
    const navigate = useNavigate();
    const location = useLocation();
    // Determine the account type message based on the role
    const accountTypeMessage = portalTeamMemberData?.role === 'owner' ? 'This is owner account' : 'This is member account';
    return (
        <Box bg={'#f8f9fb'} px={'16px 8px 28px 8px'} height={'100%'} w={'200px'} p={1} position={'fixed'} overflowY={'auto'}>

            {/* Render user info section */}
            <Box p={'16px 8px 20px 8px'}>
                <CommonBoxContainer>
                    <Avatar size={'sm'} name={user?.name} src=' ' />
                    <Text ml={2} fontSize={'14px'}>
                        {user?.name || 'Himel'} {/* Default name if user name not available */}
                    </Text>
                </CommonBoxContainer>
            </Box>
            {/* Display account type message for testing */}
            <Box ml={'13px'} fontSize={'13px'} color={'red'}>
                <Text>For test purpose</Text>
                <Text>{accountTypeMessage}</Text>
            </Box>

            {/* Render navigation items from navItemList */}
            {navItemList.map(group => (
                <Box key={group.group} mb={'5px'}>
                    {group.items.map(item => (
                        <React.Fragment key={item.label}>
                            {/* NavItem component for each navigation item */}
                            <NavItem key={item.label} isActive={location.pathname.includes(item.path)} onClick={() => navigate(item.path)} icon={item.icon}>
                                {item.label}
                            </NavItem>
                            {/* Conditional rendering for items with extensions */}
                            {
                                item.label === 'Extentions' && (
                                    <Box ml={4}>
                                        {/* Filter and render non-default apps as NavItems */}
                                        {portal?.apps
                                            ?.filter(app => !app.isDefault)
                                            .map(app => (
                                                <NavItem
                                                    key={app.id}
                                                    isActive={location.search.includes(app.id)}
                                                    onClick={() => navigate(`/extentions/?id=${app.id}`)}
                                                    icon={item.icon}
                                                >
                                                    {app.name}
                                                </NavItem>
                                            ))}
                                    </Box>
                                )
                            }
                        </React.Fragment>
                    ))}
                    <Divider mt={'5px'} />
                </Box>
            ))}
        </Box>
    );
};
export default SidebarContent;