
import CardBox from '../../components/shared/CardBox';

import { useState } from 'react';
import { Button } from 'flowbite-react';

import Addusermodal from './Addusermodal'

import PaginationTable from './PaginationTable';
import BreadcrumbComp from 'src/layouts/full/shared/breadcrumb/BreadcrumbComp';

import { triggerGoogleTranslateRescan } from 'src/utils/triggerTranslateRescan';
const Usermanagment = () => {
 

      const [placeModal, setPlaceModal] = useState(false);
     let modalPlacement="center"

 
      
    

  return (
    <>
      <BreadcrumbComp    items={[{ title: "User Management", to: "/" }]}
        title="User Management"/>
       <CardBox>

        <div className='flex justify-between items-center'>

         <h5 className="card-title">User Management</h5>
         <Button onClick={() => {setPlaceModal(true),   triggerGoogleTranslateRescan();}} className="w-fit" color="primary">
          New  Add User 
          </Button>
        </div>
      <div>
        <PaginationTable />
      </div>
      <Addusermodal setPlaceModal={setPlaceModal} modalPlacement={modalPlacement}  placeModal={placeModal}/>
     
  </CardBox>
  </>
  );
};

export default Usermanagment;

