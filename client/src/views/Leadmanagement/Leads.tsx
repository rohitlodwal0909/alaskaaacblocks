import React, { useState } from 'react';

import BreadcrumbComp from 'src/layouts/full/shared/breadcrumb/BreadcrumbComp';
import LeadsTable from './LeadComponent/LeadsTable'
import { Button } from 'flowbite-react';
import { triggerGoogleTranslateRescan } from 'src/utils/triggerTranslateRescan';
import AddLeadmodal from './LeadComponent/AddLeadmodal'
import CardBox from 'src/components/shared/CardBox';
import { useSelector } from 'react-redux';
const Leads: React.FC = () => {
        const logindata = useSelector((state: any) => state.authentication?.logindata);
      const [placeModal, setPlaceModal] = useState(false);
     let modalPlacement="center"
 const [searchText, setSearchText] = useState('');
 
const [fromDate, setFromDate] = useState('');
const [toDate, setToDate] = useState('');



  return (
    <>
     <BreadcrumbComp    items={[{ title: "Leads Management", to: "/" }]}
        title="Leads Management"/>
         <CardBox>
        <div className='flex justify-end items-center'>
           <input type="text" placeholder="Search..." value={searchText}
                onChange={e => setSearchText(e.target.value)}
                className="me-2 p-2 border rounded-sm border-gray-300 text-sm " />
          <input
    type="date"
    value={fromDate}
    onChange={(e) => setFromDate(e.target.value)}
    className="p-2 border rounded-sm border-gray-300 text-sm me-2"
    placeholder="From Date"
  />
   To
  <input
    type="date"
    value={toDate}
    onChange={(e) => setToDate(e.target.value)}
    className="p-2 border rounded-sm border-gray-300 text-sm ms-2 me-2"
    placeholder="To Date"
  />
          

             <Button onClick={() => {setPlaceModal(true),   triggerGoogleTranslateRescan();}} className="w-fit rounded-sm" color="primary">
              Create New Lead 
              </Button>
            </div>
      <LeadsTable searchText={searchText}   fromDate={fromDate} toDate={toDate}/>
     </CardBox>
      <AddLeadmodal  setPlaceModal={setPlaceModal} modalPlacement={modalPlacement}  placeModal={placeModal} logindata={logindata} />
    </>
  );
};

export default Leads;