import BreadcrumbComp from 'src/layouts/full/shared/breadcrumb/BreadcrumbComp';
import BatchingTable from './BatchingComponent.tsx/BatchingTable'
import CardBox from 'src/components/shared/CardBox';
// import { Button } from 'flowbite-react';
// import { triggerGoogleTranslateRescan } from 'src/utils/triggerTranslateRescan';
// import { useState } from 'react';
// import AddBatchModal from './BatchingComponent.tsx/AddBatchModal';
import { useSelector } from 'react-redux';
const Batching = () => {
  // const [showmodal , setShowmodal] = useState(false)
      const logindata = useSelector((state: any) => state.authentication?.logindata);
  return (
    <>
      <BreadcrumbComp    items={[{ title: "Batching ", to: "/" }]}
        title="Batching"/>
        <CardBox>
          <div className="flex justify-end my-1">
{/* 
             <Button onClick={() => {setShowmodal(true),   triggerGoogleTranslateRescan();}} className="w-fit rounded-sm" color="primary">
                        Create New Batching  
                        </Button> */}
          </div>
        <BatchingTable  logindata={logindata}/>
       </CardBox>
                {/* <AddBatchModal  show={showmodal} setShowmodal={setShowmodal} logindata={logindata} /> */}
        </>
  )
}

export default Batching