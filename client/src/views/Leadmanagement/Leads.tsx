import React, { useState } from 'react';

import BreadcrumbComp from 'src/layouts/full/shared/breadcrumb/BreadcrumbComp';
import LeadsTable from './LeadComponent/LeadsTable'
import { Button } from 'flowbite-react';
import { triggerGoogleTranslateRescan } from 'src/utils/triggerTranslateRescan';
import AddLeadmodal from './LeadComponent/AddLeadmodal'
import CardBox from 'src/components/shared/CardBox';
const Leads: React.FC = () => {
  
      const [placeModal, setPlaceModal] = useState(false);
     let modalPlacement="center"




  return (
    <>
     <BreadcrumbComp    items={[{ title: "Leads", to: "/" }]}
        title="Leads"/>
         <CardBox>
     <div className='flex justify-between items-center'>
    
             <h5 className="card-title">Leads Management</h5>
             <Button onClick={() => {setPlaceModal(true),   triggerGoogleTranslateRescan();}} className="w-fit" color="primary">
              Create New Lead 
              </Button>
            </div>
      <LeadsTable />
     </CardBox>
      <AddLeadmodal  setPlaceModal={setPlaceModal} modalPlacement={modalPlacement}  placeModal={placeModal}  />
    </>
  );
};

export default Leads;