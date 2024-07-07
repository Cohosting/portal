// import { Box, Button, Flex, Slide, useDisclosure, useMediaQuery, useOutsideClick } from '@chakra-ui/react'
// import React, { useContext, useRef, useState } from 'react';
// import { GiHamburgerMenu } from 'react-icons/gi';

// import { Overlay } from '../../components/UI/Overlay';
// import SidebarContent from './SidebarContent';
// import { useSelector } from 'react-redux';
// import { usePortalData, usePortalTeamMember } from '../../hooks/react-query/usePortalData';
// import { Dialog, DialogBackdrop, DialogPanel, TransitionChild } from '@headlessui/react';
// import { XMarkIcon } from '@heroicons/react/20/solid';
// import Sidebar from './Sidebar';

// // Layout component that wraps around the entire application UI, providing a sidebar and main content area.
// export const Layout = ({ children, }) => {
//   const [sidebarOpen, setSidebarOpen] = useState(false);

//   const [isMobileView] = useMediaQuery('(max-width: 760px)')
//   const { user } = useSelector(state => state.auth)
//   const { data: portal } = usePortalData(user?.portals)
//   const { data: portalTeamMemberData } = usePortalTeamMember(user?.portals[0], user.email)
//   const ref = useRef();
//   // Close sidebar when clicking outside of it
//   useOutsideClick({
//     ref: ref,
//     handler: () => onClose(false),
//   })

//   const { isOpen, onOpen, onClose } = useDisclosure();

//   return (

//     <>
//       <div>
//         <Dialog open={sidebarOpen} onClose={setSidebarOpen} className="relative z-50 lg:hidden">
//           <DialogBackdrop
//             transition
//             className="fixed inset-0 bg-gray-900/80 transition-opacity duration-300 ease-linear data-[closed]:opacity-0"
//           />
//           <div className="fixed inset-0 flex">
//             <DialogPanel
//               transition
//               className="relative mr-16 flex w-full max-w-xs flex-1 transform transition duration-300 ease-in-out data-[closed]:-translate-x-full"
//           >
//               <TransitionChild>
//                 <div className="absolute left-full top-0 flex w-16 justify-center pt-5 duration-300 ease-in-out data-[closed]:opacity-0">
//                   <button type="button" onClick={() => setSidebarOpen(false)} className="-m-2.5 p-2.5">
//                     <span className="sr-only">Close sidebar</span>
//                     <XMarkIcon aria-hidden="true" className="h-6 w-6 text-white" />
//                   </button>
//                 </div>
//               </TransitionChild>
//               <Sidebar />
//             </DialogPanel>
//           </div>
//         </Dialog>

//         <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
//           <Sidebar />
//         </div>

//         <div className="lg:pl-72">
//           {/* <Navbar setSidebarOpen={setSidebarOpen} /> */}
//           <p>main content</p>
//         </div>
//       </div>
//     </>
//     // <Flex height={'100vh'} overflowY={'auto'}>
//     //   {/* Mobile view hamburger menu button */}
//     //   {
//     //     isMobileView && (
//     //       <Box p={1}>
//     //         <Button onClick={onOpen} mt={'12px'} ml={'8px'} border={'1px solid'} borderColor={'gray.300'} borderRadius={3} variant={'unstyled'} p={3} ><GiHamburgerMenu /></Button>
//     //       </Box>
//     //     )
//     //   }
//     //   {/* Overlay and slide-in sidebar for mobile view */}
//     //   <Box zIndex={99999999999}>
//     //     <Overlay isOpen={isOpen} />

//     //     <Slide in={isOpen} direction="left">
//     //       <Box
//     //         position="fixed"
//     //         top="0"
//     //         left="0"
//     //         width="200px"
//     //         height="100%"
//     //         background="white"
//     //         boxShadow="-4px 0 8px rgba(0, 0, 0, 0.2)"
//     //         zIndex={9999999}
//     //       >
//     //         {/* Sidebar content for mobile view */}
//     //         <SidebarContent />
//     //       </Box>
//     //     </Slide>
//     //   </Box>

//     //   {/* Non-mobile view sidebar content */}
//     //   {
//     //     !isMobileView && (
//     //       <SidebarContent
//     //         user={user}
//     //         portal={portal}
//     //         portalTeamMemberData={portalTeamMemberData}
//     //       />
//     //     )
//     //   }

//     //   {/* Main content area */}
//     //   <Box paddingLeft={!isMobileView && '200px'} height={'100%'} pr={1} flex={1}>
//     //     {children}
//     //   </Box>
//     // </Flex>
//   );
// };



import { useState } from 'react';
import SidebarDialog from './SidebarDialog';
import SidebarStatic from './SidebarStatic';
// import Navbar from './Navbar';
// import MainContent from './MainContent';

export const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <SidebarDialog sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <SidebarStatic />
      <div className="lg:pl-72">

        <main className="flex flex-col h-screen bg-gray-100">
          {children}
        </main>
      </div>
    </>
  );
}
