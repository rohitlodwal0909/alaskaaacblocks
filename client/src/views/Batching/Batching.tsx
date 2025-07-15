import BreadcrumbComp from 'src/layouts/full/shared/breadcrumb/BreadcrumbComp';
import BatchingTable from './BatchingComponent.tsx/BatchingTable'
import CardBox from 'src/components/shared/CardBox';
import { Button } from 'flowbite-react';
import { triggerGoogleTranslateRescan } from 'src/utils/triggerTranslateRescan';
import { useState } from 'react';
import AddBatchModal from './BatchingComponent.tsx/AddBatchModal';
const Batching = () => {
  const [showmodal , setShowmodal] = useState(false)
  return (
    <>
      <BreadcrumbComp    items={[{ title: "Batching ", to: "/" }]}
        title="Batching"/>
        <CardBox>
          <div className="flex justify-end my-1">

             <Button onClick={() => {setShowmodal(true),   triggerGoogleTranslateRescan();}} className="w-fit rounded-sm" color="primary">
                        Create New Batching  
                        </Button>
          </div>
        <BatchingTable/>

       </CardBox>
       <AddBatchModal  show={showmodal} setShowmodal={setShowmodal} />
        </>
  )
}

export default Batching